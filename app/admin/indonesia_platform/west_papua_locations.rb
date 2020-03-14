ActiveAdmin.register_page 'Indonesia Platform West Papua Locations' do
  include DataUploader::SharedAdmin

  section_name = 'west_papua_locations'
  platform_name = 'indonesia_platform'

  controller do
    def section_name
      'west_papua_locations'
    end

    def platform_name
      'indonesia_platform'
    end

    def s3_folder_path
      "#{CW_FILES_PREFIX}west_papua_locations"
    end

    def path
      admin_indonesia_platform_west_papua_locations_path
    end

    def section
      section_repository.filter_by_section_and_platform(
        section_name,
        platform_name
      )
    end

    def import_worker
      DataUploader::BaseImportWorker.perform_async(section.id, 'WestPapua::ImportLocations', current_admin_user.email)
    end

    def section_repository
      @section_repository ||= DataUploader::Repositories::SectionRepository.new
    end

    def dataset_repository
      @dataset_repository ||= DataUploader::Repositories::DatasetRepository.new
    end
  end

  menu parent: 'West Papua Platform',
       label: section_name.split('_').map(&:capitalize).join(' '),
       if: proc { DataUploader::Helpers::Ability.can_view?(platform_name) }

  section_proc = proc {
    DataUploader::Repositories::SectionRepository.new.filter_by_section_and_platform(
      section_name,
      platform_name
    )
  }

  datasets_proc = proc {
    DataUploader::Repositories::DatasetRepository.new.filter_by_section(section_proc.call.id)
  }

  content do
    render partial: 'data_uploader/admin/form_upload_datasets', locals: {
      datasets: datasets_proc.call,
      upload_path: admin_indonesia_platform_west_papua_locations_upload_datafile_path,
      download_path: admin_indonesia_platform_west_papua_locations_download_datafiles_path,
      download_single_data_file_path:
          admin_indonesia_platform_west_papua_locations_download_datafile_path,
      import_path: admin_indonesia_platform_west_papua_locations_run_importer_path,
      import_button_disabled: section_proc.call.worker_logs.started.any?,
      logs: section_proc.call.worker_logs.order(created_at: :desc)
    }
  end
end
