module ImportSpecsHelpers
  def stub_with_files(files)
    Aws.config[:s3] = {
      stub_responses: {
        get_object: lambda do |context|
          {body: files[context.params[:key]]}
        end
      }
    }
  end
end
