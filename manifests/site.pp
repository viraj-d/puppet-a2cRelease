

class a2creleases::site inherits a2creleases {


 # copy latest release files
   file{"${drive}Inetpub":
    ensure => directory
  }
  
  file{'deploy-application':
    path    => "${drive}Inetpub\a2c",
    ensure  => directory,
    source  => 'puppet:///modules/a2creleases/A2CApplication',
    recurse => true
  }

 file{"$sitepath":
    ensure  => directory,
    source	=> 'puppet:///modules/a2creleases/A2CApplication',
    recurse => true
	}

}
