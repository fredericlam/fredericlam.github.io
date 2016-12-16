require 'twitter'
 
client = Twitter::REST::Client.new do |config|
  config.consumer_key        = "lYK2eJtZD1Dw4z7GHMIjO2MKp"
  config.consumer_secret     = "d3wwLm23CvtW3IwSphUypCHruinyBjIwuYt9YkJJoV1HEVyV9E"
  config.access_token        = "3188119457-pC766JLdpIUP0oDj4FugEIsGvpKDjBYVILHIsW4"
  config.access_token_secret = "fKf3EqewgHk6XGU7Oltcr3B5EyXZnp3yV8ln4FM25Lx5L"
end

client.search("from:iarcwho", result_type: "recent").each do |tweet|
  puts tweet.text
end