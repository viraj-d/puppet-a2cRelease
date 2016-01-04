

class a2creleases( $drive = 'C:\\',
		   $a2cservername = 'A2C1',
	    	   $a2cuserid = 'A2CUser',
		   $a2cpassword = 'Oak1nd1a',
		   $a2cdbname = 'MASTER',
                   $installutil_filepath = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\InstallUtil.exe',  
                   $username = 'A2C1\Administrator',
                   $password = 'Ir0nbr1dg3' ,    
                   $binary_sevice_name = 'A2C.Core.Component.exe',
                   $service_name = 'Scheduler',
                   $service_display_name = 'A2C Core Component')
{

include a2creleases::db
include a2creleases::service		   

}
