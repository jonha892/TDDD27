{application,mariaex,
             [{registered,[]},
              {description,"Pure elixir database driver for MariaDB / MySQL."},
              {vsn,"0.8.2"},
              {modules,['Elixir.DBConnection.Query.Mariaex.Query',
                        'Elixir.Mariaex','Elixir.Mariaex.Cache',
                        'Elixir.Mariaex.Coder','Elixir.Mariaex.Coder.Utils',
                        'Elixir.Mariaex.Column','Elixir.Mariaex.Connection',
                        'Elixir.Mariaex.Connection.Ssl',
                        'Elixir.Mariaex.Connection.Tcp',
                        'Elixir.Mariaex.Cursor','Elixir.Mariaex.Error',
                        'Elixir.Mariaex.LruCache','Elixir.Mariaex.Messages',
                        'Elixir.Mariaex.Protocol',
                        'Elixir.Mariaex.ProtocolHelper',
                        'Elixir.Mariaex.Query','Elixir.Mariaex.Result',
                        'Elixir.Mariaex.RowParser',
                        'Elixir.String.Chars.Mariaex.Query']},
              {applications,[kernel,stdlib,elixir,logger,crypto,decimal,
                             db_connection]}]}.