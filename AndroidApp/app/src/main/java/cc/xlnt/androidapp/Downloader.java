package cc.xlnt.androidapp;

import android.os.Handler;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;

import cc.xlnt.androidapp.Devices.DMXRGBLED;
import cc.xlnt.androidapp.Devices.Device;
import cc.xlnt.androidapp.Devices.Temperature;

import static cc.xlnt.androidapp.Discoverer.LometationDevices;

/**
 * Created by LeGone on 28.10.2016.
 */

public class Downloader extends Thread
{
	private static final String TAG = "Downloader";
	public static final int PORT = 8080;
	public static final int TIMEOUT_MS = 5000;
	public static final int REFRESHTIME = 30000;
	private Handler AHandler = new Handler();

	private Runnable ARunnable;

	public void run()
	{
		ARunnable = new Runnable()
		{
			@Override
			public void run()
			{
				if (!Discoverer.AtWork)
				{
					Download();
				}

				AHandler.postDelayed(this, REFRESHTIME);
			}
		};

		AHandler.postDelayed(ARunnable, REFRESHTIME);
	}

	public static String DownloadURL(String URL) throws IOException
	{
		URL RoomURL = new URL("http://" + URL + ":" + PORT);
		HttpURLConnection AHttpURLConnection = (HttpURLConnection) RoomURL.openConnection();
		AHttpURLConnection.setReadTimeout(TIMEOUT_MS);
		AHttpURLConnection.setConnectTimeout(TIMEOUT_MS);
		AHttpURLConnection.setRequestMethod("GET");
		AHttpURLConnection.setDoInput(true);
		AHttpURLConnection.setAllowUserInteraction(false);
		AHttpURLConnection.setUseCaches(false);

		//Starts the query
		AHttpURLConnection.connect();

		StringBuilder AStringBuilder = new StringBuilder();
		BufferedReader ABufferedReader = new BufferedReader(new InputStreamReader(AHttpURLConnection.getInputStream()));
		String Line;
		while ((Line = ABufferedReader.readLine()) != null)
		{
			AStringBuilder.append(Line + "\n");
		}
		ABufferedReader.close();
		Line = AStringBuilder.toString();

		AHttpURLConnection.disconnect();

		return Line;
	}

	// Only for IPv4
	public static String ConvertInetAddressToString(InetAddress AInetAddress)
	{
		int I = 4;
		String IPAddress = "";
		byte[] RawBytes = new byte[0];
		RawBytes = AInetAddress.getAddress();

		for (byte Raw : RawBytes)
		{
			IPAddress += (Raw & 0xFF);
			if (--I > 0)
			{
				IPAddress += ".";
			}
		}

		return IPAddress;
	}

	private void Download()
	{
		try
		{
			for (LometationDevice ALometationDevice : LometationDevices)
			{
				String Address = ConvertInetAddressToString(ALometationDevice.Address);
				String Response = Downloader.DownloadURL(Address);

				try
				{
					JSONArray JSONDevices = new JSONArray(Response);
					int Length = JSONDevices.length();

					for (int DeviceIndex = 0; DeviceIndex < Length; DeviceIndex++)
					{
						JSONObject AJSONObject = (JSONObject) JSONDevices.get(DeviceIndex);

						String Name = AJSONObject.get("name").toString();
						String Room = AJSONObject.get("room").toString();

						for (Device ADevice : ALometationDevice.Devices)
						{
							if (ADevice.Widget != null)
							{
								if (ADevice.Room.compareTo(Room) == 0 && ADevice.Name.compareTo(Name) == 0)
								{
									if (ADevice.getClass() == Temperature.class)
									{
										Temperature ATemperature = (Temperature) ADevice;
										ATemperature.Celsius = ((Number) AJSONObject.get("value")).floatValue();
									}
									else if (ADevice.getClass() == Temperature.class)
									{
										DMXRGBLED ADMXRGBLED = (DMXRGBLED) ADevice;
										ADMXRGBLED.R = (int) AJSONObject.get("r");
										ADMXRGBLED.G = (int) AJSONObject.get("g");
										ADMXRGBLED.B = (int) AJSONObject.get("b");
									}
								}

								ADevice.Widget.Refresh();
							}
						}
					}
				}
				catch (JSONException e)
				{
					e.printStackTrace();
				}
			}
		}
		catch (IOException E)
		{
			Log.e(TAG, "Could not send discovery request", E);
		}
	}
}