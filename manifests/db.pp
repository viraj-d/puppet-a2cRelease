class a2creleases::db inherits a2creleases {
   
  require a2c::db  

  file { 'DBUpdates-A2C':
    ensure  => directory,
    path    => "${drive}DBUpdates\\A2C",
    source  => 'puppet:///modules/a2creleases/A2CDatabase',
    recurse => true,
    notify  => Exec['Deploy-A2C']
  }

  exec { 'Deploy-A2C':
    command     => "dtexec.exe /F ${drive}DBUpdates\\packages\\A2C.dtsx  /SET \\package.Variables[User::ServerName].Value;${a2cservername} /SET \\package.Variables[User::UserID].Value;${a2cuserid} /SET \\package.Variables[User::Password].Value;${a2cpassword} /SET \\package.Variables[User::DatabaseName].Value;${a2cdbname} /SET \\package.Variables[User::ScriptsFolderPath].Value;${drive}DBUpdates\\A2C\\\\",
    path        => 'C:\Program Files\Microsoft SQL Server\100\DTS\Binn',
    timeout     => 0,
    refreshonly => true
  }

}