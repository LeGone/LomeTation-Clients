package cc.xlnt.androidapp;


import android.content.Context;
import android.net.DhcpInfo;
import android.net.wifi.WifiManager;
import android.os.AsyncTask;
import android.support.design.internal.NavigationMenu;
import android.support.design.internal.NavigationSubMenu;
import android.support.design.widget.NavigationView;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketTimeoutException;
import java.util.ArrayList;

import cc.xlnt.androidapp.Devices.DMXRGBLED;
import cc.xlnt.androidapp.Devices.Device;
import cc.xlnt.androidapp.Devices.Temperature;

/**
 * Created by LeGone and Lordison on 28.07.2015.
 */
public class Discoverer extends AsyncTask<Void, Void, Void>
{
	private static final int DISCOVERY_PORT = 2562;
	private static final int TIMEOUT_MS = 5000;
	private static final String CHALLENGE = "LomeTationDiscoveryRequest";
	private static final String TAG = "Discovery";
	private android.content.Context AContext = null;
	private InetAddress BroadcastAddress;
	public static boolean AtWork = false;

	public static ArrayList<LometationDevice> LometationDevices = null;

	public Discoverer(android.content.Context AContext)
	{
		this.AContext = AContext;
	}

	private void SendDiscovery(DatagramSocket Socket) throws IOException
	{
		DatagramPacket Packet = new DatagramPacket(CHALLENGE.getBytes(), CHALLENGE.length(), BroadcastAddress, DISCOVERY_PORT);
		Socket.send(Packet);
	}

	private void ListenForDevices(DatagramSocket Socket) throws IOException
	{
		byte[] Buffer = new byte[1024];
		try
		{
			while (true)
			{
				DatagramPacket Packet = new DatagramPacket(Buffer, Buffer.length);
				Socket.receive(Packet);
				String S = new String(Packet.getData(), 0, Packet.getLength());
				if (!S.equals(CHALLENGE))
				{
					LometationDevices.add(new LometationDevice(S.toLowerCase(), Packet.getAddress()));
				}
			}
		} catch (SocketTimeoutException E)
		{
			Log.d(TAG, "Receive timed out");
		}
	}

	public static InetAddress GetBroadcastAddress(Context AContext) throws IOException
	{
		WifiManager AWifiManager = (WifiManager) AContext.getSystemService(Context.WIFI_SERVICE);
		DhcpInfo DHCP = AWifiManager.getDhcpInfo();
		// handle null somehow

		if (DHCP != null)
		{
			int Broadcast = (DHCP.ipAddress & DHCP.netmask) | ~DHCP.netmask;
			byte[] Quads = new byte[4];
			for (int K = 0; K < 4; K++)
				Quads[K] = (byte) ((Broadcast >> K * 8) & 0xFF);

			return (InetAddress.getByAddress(Quads));
		}
		return (null);
	}

	@Override
	protected Void doInBackground(Void... Params)
	{
		LometationDevices = new ArrayList<LometationDevice>();

		try
		{
			BroadcastAddress = Discoverer.GetBroadcastAddress(AContext);
		}
		catch (IOException E)
		{
			Log.e(TAG, "Could not receive broadcastaddress", E);
		}

		try
		{
			DatagramSocket Socket = new DatagramSocket(DISCOVERY_PORT);
			Socket.setBroadcast(true);
			Socket.setSoTimeout(TIMEOUT_MS);

			SendDiscovery(Socket);
			ListenForDevices(Socket);
			Socket.close();

			for (LometationDevice ALometationDevice : LometationDevices)
			{
				String Address = Downloader.ConvertInetAddressToString(ALometationDevice.Address);
				String Response = Downloader.DownloadURL(Address);

				try
				{
					JSONArray JSONDevices = new JSONArray(Response);
					int Length = JSONDevices.length();

					for (int DeviceIndex = 0; DeviceIndex < Length; DeviceIndex++)
					{
						JSONObject AJSONObject = (JSONObject) JSONDevices.get(DeviceIndex);

						String Type = AJSONObject.get("type").toString();
						String Name = AJSONObject.get("name").toString();
						String Room = AJSONObject.get("room").toString();

						Device ADevice;

						if (Type.compareTo("Temperature") == 0)
						{
							Temperature ATemperature = new Temperature();
							ATemperature.Celsius = ((Number) AJSONObject.get("value")).floatValue();
							ADevice = (Device) ATemperature;
						}
						else if (Type.compareTo("DMXRGB") == 0)
						{
							DMXRGBLED ADMXRGBLED = new DMXRGBLED();
							ADMXRGBLED.R = (int) AJSONObject.get("r");
							ADMXRGBLED.G = (int) AJSONObject.get("g");
							ADMXRGBLED.B = (int) AJSONObject.get("b");
							ADevice = (Device) ADMXRGBLED;
						}
						else
						{
							ADevice = new Device();
						}

						ADevice.Parent = ALometationDevice;
						ADevice.Name = Name;
						ADevice.Room = Room;

						ALometationDevice.Devices.add(ADevice);
					}
				} catch (JSONException e)
				{
					e.printStackTrace();
				}
			}
		}
		catch (IOException E)
		{
			Log.e(TAG, "Could not send discovery request", E);
		}

		return (null);
	}

	ArrayList<String> Rooms = new ArrayList<String>();

	@Override
	protected void onPostExecute(Void Result)
	{
		NavigationView ANavigationView = (NavigationView) MainActivity.Self.findViewById(R.id.nav_view);
		NavigationMenu AMenu = (NavigationMenu) ANavigationView.getMenu();

		AMenu.clearAll();

		NavigationSubMenu SubMenu = (NavigationSubMenu) AMenu.addSubMenu("Rooms");

		int Room = 0;
		for (LometationDevice ALometationDevice : LometationDevices)
		{
			for (Device ADevice : ALometationDevice.Devices)
			{
				if (!Rooms.contains(ADevice.Room))
				{
					SubMenu.add(0, Room++, 0, ADevice.Room).setIcon(R.drawable.ic_menu_manage);
					Rooms.add(ADevice.Room);
				}
			}
		}
		SubMenu.setGroupCheckable(0, true, true);

		SubMenu = (NavigationSubMenu) AMenu.addSubMenu("Settings");
		SubMenu.add(0, 0, 0, "Refresh").setIcon(R.drawable.ic_menu_manage);
		SubMenu.setGroupCheckable(0, true, true);

		AtWork = false;
	}

	@Override
	protected void onPreExecute()
	{
		AtWork = true;
	}

	@Override
	protected void onProgressUpdate(Void... Values)
	{
	}
}

