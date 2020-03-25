package org.dimensinfin.slot;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class SimpleRead implements Runnable {
	protected static final Logger logger = LoggerFactory.getLogger( SimpleRead.class );

	public static void main( String[] args ) {
		logger.info( ">[SimpleRead.main]> Starting..." );
		System.setSecurityManager( null );

		final List<String> portNamesStandard = SerialPortNames.getSerialPortNames();
		for (String name : portNamesStandard)
			logger.info( ">[SimpleRead.main]> portStandard: {}", name );

		final String[] portNames = NamedSerialPortFactory.getPortNames();
		for (int i = 0; i < portNames.length; i++)
			logger.info( ">[SimpleRead.main]> portName: " + portNames[i] );
		logger.info( "<[SimpleRead.main]> No port found. Terminating" );
	}

	public void run() {
		try {
			Thread.sleep( 20000 );
		} catch (InterruptedException e) {System.out.println( e );}
	}
}
