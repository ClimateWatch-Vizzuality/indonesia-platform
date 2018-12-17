ActiveAdmin.register_page 'Translations' do
  content title: 'Translations' do
    table_for TranslationEntry.find_by(params), class: 'table index_table' do
      column :key
      column 'English text', :en_value
      column 'Indonesian text', :id_value
      column 'Actions' do |translation|
        link_to 'Edit', admin_translations_edit_path(key: translation.key)
      end
    end
  end

  sidebar :filter, only: :index, partial: 'filter'

  page_action :edit, method: :get do
    entry = TranslationEntry.all.find { |te| te.key.to_s == params[:key].to_s }

    return redirect_to admin_translations_path unless entry.present?

    render 'edit', locals: {entry: entry}, layout: 'active_admin'
  end

  page_action :update, method: :post do
    if TranslationEntry.new(entry_params).save
      flash[:notice] = 'Translations saved!'
      redirect_to admin_translations_path
    else
      render 'edit'
    end
  end

  controller do
    def entry_params
      params.require(:entry).permit(:key, :en_value, :id_value)
    end
  end
end
