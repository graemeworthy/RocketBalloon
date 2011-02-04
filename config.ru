# This is just here so i can pretend i'm running off a server, it's a direct passthrough
@root = File.expand_path(File.dirname(__FILE__))

run Proc.new { |env|
  # Extract the requested path from the request
  path = Rack::Utils.unescape(env['REQUEST_PATH'])
  index_file = @root + "#{path}/index.html"

  if File.exists?(index_file)
    # Return the index
    [200, {'Content-Type' => 'text/html'}, File.read(index_file)]
  else
    # Pass the request to the directory app
    Rack::Directory.new(@root).call(env)
  end
}

