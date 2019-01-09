module Code
  def self.create(name)
    return unless name.present?

    name.parameterize.underscore.upcase
  end
end
