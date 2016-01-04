

class a2creleases::service inherits a2creleases  {

  file{"$a2cservicepath":
 	ensure	=> directory,
 	source  => 'puppet:///modules/a2creleases/A2CCoreComponent',
 	recurse => 'true'
      }

  # Execute Windows service
  exec{"install_A2C.Core.Component":
 	command	=> "\"${installutil_filepath}\" \" /i ${a2cservicepath}\\${binary_sevice_name} /servicename=\"${service_name}\" /displayname=\"${service_display_name}\"  /username=\"${username}\" /password=\"${password}",
 	path      => "${a2cservicepath}",
  	onlyif    => "if ((Get-Service \"${service_name}\" -ErrorAction SilentlyContinue).DisplayName -eq \$null) { exit 0 } else { exit 1 }",
  	provider  => powershell
  }
}
