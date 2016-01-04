

class a2creleases::site inherits a2creleases {

 File { source_permissions => ignore }

 file{"$sitepath":
    ensure  => directory,
    source	=> 'puppet:///modules/a2creleases/files/A2CApplication',
    recurse => true
	}

}
