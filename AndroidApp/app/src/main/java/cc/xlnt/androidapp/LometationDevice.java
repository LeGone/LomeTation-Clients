package cc.xlnt.androidapp;

import java.net.InetAddress;
import java.util.ArrayList;

import cc.xlnt.androidapp.Devices.Device;

/**
 * Created by LeGone on 20.10.2016.
 */

public class LometationDevice
{
	public String Hostname;
	public InetAddress Address;
	public ArrayList<Device> Devices = new ArrayList<Device>();

	public LometationDevice(String Hostname, InetAddress Address)
	{
		this.Hostname = Hostname;
		this.Address = Address;
	}
}
