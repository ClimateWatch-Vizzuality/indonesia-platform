HistoricalEmissions::HistoricalEmissionsController.class_eval do
  include Localizable

  HistoricalEmissionsMetadata = Struct.new(
    :data_sources,
    :sectors,
    :metrics,
    :gases,
    :gwps,
    :locations
  ) do
    alias_method :read_attribute_for_serialization, :send

    def self.model_name
      'metadata'
    end
  end

  def meta
    render(
      json: HistoricalEmissionsMetadata.new(
        merged_records(grouped_records),
        ::HistoricalEmissions::Sector.all,
        ::HistoricalEmissions::Metric.all,
        ::HistoricalEmissions::Gas.all,
        ::HistoricalEmissions::Gwp.all,
        Location.all
      ),
      serializer: ::HistoricalEmissions::MetadataSerializer
    )
  end
end
