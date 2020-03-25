package org.dimensinfin.slot;

import com.fazecast.jSerialComm.SerialPort;

public class NamedSerialPortFactory {
	public static String[] getPortNames() {
		SerialPort[] ports = SerialPort.getCommPorts();
		String[] result = new String[ports.length];
		for (int i = 0; i < ports.length; i++) {
			result[i] = ports[i].getSystemPortName();
		}
		return result;
	}
}
