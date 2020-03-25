package org.dimensinfin.slot;

import java.util.ArrayList;
import java.util.List;

import com.fazecast.jSerialComm.SerialPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SerialPortNames {
	protected static final Logger logger = LoggerFactory.getLogger( SerialPortNames.class );

	public static List<String> getSerialPortNames() {
		final List<String> portNames = new ArrayList<>();
		logger.info( ">[SimpleRead.main]> Starting..." );
		System.setSecurityManager( null );
		final SerialPort[] ports = SerialPort.getCommPorts();
		for (int i = 0; i < ports.length; i++) {
			logger.info( ">[SimpleRead.main]> port: " + ports[i] );
			portNames.add( ports[i].getSystemPortName() );
		}
		logger.info( "<[SimpleRead.main]> No port found. Terminating" );
		return portNames;
	}
}
