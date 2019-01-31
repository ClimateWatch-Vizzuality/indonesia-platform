HistoricalEmissions::HistoricalEmissionsController.class_eval do
  include Localizable

  before_action :include_sub_locations, only: [:index]

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

  def download
    data_sources = DataSource.where(short_title: sources)
    filter = HistoricalEmissions::Filter.new({})
    emissions_csv_content = HistoricalEmissions::CsvContent.new(filter).call
    targets = EmissionTarget::Value.includes(:location, :label, :sector)
    targets = targets.where(locations: {iso_code3: targets_locations}) if targets_locations
    targets_csv = Api::V1::EmissionTarget::ValueCSVSerializer.new(targets).to_csv

    render zip: {
      'historical_emissions.csv' => emissions_csv_content,
      'emission_targets.csv' => targets_csv,
      'data_sources.csv' => data_sources.to_csv
    }
  end

  def meta
    render(
      json: HistoricalEmissionsMetadata.new(
        fetch_meta_data_sources,
        fetch_meta_sectors,
        ::HistoricalEmissions::Metric.all,
        ::HistoricalEmissions::Gas.all,
        ::HistoricalEmissions::Gwp.all,
        Location.all
      ),
      serializer: ::HistoricalEmissions::MetadataSerializer
    )
  end

  private

  def sources
    params[:source]&.split(',')
  end

  def targets_locations
    params[:targets_location]&.split(',')
  end

  def include_sub_locations
    return unless params[:location].present?

    locations = params[:location].split(',')
    sub_locations = LocationMember.
      joins(:member, :location).
      where(locations: {iso_code3: locations}).
      pluck('locations_location_members.iso_code3')

    params[:location] = (locations + sub_locations).join(',')
  end
end
