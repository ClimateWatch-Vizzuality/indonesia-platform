HistoricalEmissions::Record.class_eval do
  belongs_to :metric, class_name: 'HistoricalEmissions::Metric'
end
