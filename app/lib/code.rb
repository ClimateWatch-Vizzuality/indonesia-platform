module Code
  def self.create(name)
    name.parameterize.underscore.upcase
  end
end
