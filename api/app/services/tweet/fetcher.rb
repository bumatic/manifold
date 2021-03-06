module Tweet
  # This class is responsible for fetching tweets related to a given project
  class Fetcher
    def fetch(project)
      return unless project.following_twitter_accounts?
      project.twitter_queries.find_each do |query|
        fetch_one(query)
      end
    end

    # Following is a string query
    def fetch_one(query)
      limit = 60
      options = {
        count: limit,
        result_type: query.result_type
      }
      options[:since_id] = query.most_recent_tweet_id.to_i if query.most_recent_tweet_id

      results = client.search(query, options).take(limit)
      results.each do |tweet|
        tweet_to_event(tweet, query)
      end

      max = results.max_by(&:id)&.id
      update_query_most_recent(query, max)
    end

    private

    def tweet_to_event(tweet, query)
      factory = Factory::Event.new
      event = factory.create_from_tweet(tweet, query)
      return if event.valid?
      Rails.logger.info(
        "#tweet_to_event created an invalid event: #{event.errors.full_messages}"
      )
    end

    def update_query_most_recent(query, id)
      return unless id
      query.most_recent_tweet_id = id
      query.save
    end

    def client
      settings = Settings.instance
      @client ||= Twitter::REST::Client.new do |config|
        config.consumer_key        = settings.integrations.dig(:twitter_app_id)
        config.consumer_secret     = settings.secrets.dig(:twitter_app_secret)
        config.access_token        = settings.integrations.dig(:twitter_access_token)
        config.access_token_secret = settings.secrets.dig(:twitter_access_token_secret)
      end
    end
  end
end
