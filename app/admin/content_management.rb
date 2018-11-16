ActiveAdmin.register SectionContent do
  actions :all, except: [:destroy, :create, :new]
  filter :locale
  config.sort_order = 'order_asc'
  permit_params :title, :description

  form do |f|
    f.inputs 'Main Section' do
      f.input :name, input_html: {readonly: true}
      f.input :title, label: 'Title'
      f.input :description, label: 'Description'
    end
    f.actions
  end

  index download_links: false, new_link: false, new_record: false, allow_destroy: false do
    column :name
    column :locale
    column :title
    column :description
    column :created_at
    column :updated_at
    actions
  end

  show do
    h3 section_content.name
    table_for section_content do
      column :name
      column :title
      column :description
    end
  end
end
