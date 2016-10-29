package cc.xlnt.androidapp;

import android.os.AsyncTask;
import android.util.Log;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import cc.xlnt.androidapp.Devices.Device;

/**
 * Created by LeGone on 28.07.2015.
 */
public class Uploader extends AsyncTask<Void, Void, Void>
{
	private static final String TAG = "Uploader";
	private Device ADevice;
	private String JSONValues;

	public Uploader(Device ADevice, String JSONValues)
	{
		this.ADevice = ADevice;
		this.JSONValues = JSONValues;
	}

	protected Void doInBackground(Void... Params)
	{
		try
		{
			URL AURL = new URL("http:/" + ADevice.Parent.Address + ":" + Downloader.PORT);
			HttpURLConnection AHttpURLConnection = (HttpURLConnection) AURL.openConnection();
			AHttpURLConnection.setReadTimeout(Downloader.TIMEOUT_MS);
			AHttpURLConnection.setConnectTimeout(Downloader.TIMEOUT_MS);
			AHttpURLConnection.setRequestMethod("PUT");
			AHttpURLConnection.setAllowUserInteraction(false);
			AHttpURLConnection.setUseCaches(false);
			AHttpURLConnection.setDoOutput(true);

			OutputStreamWriter AOutputStreamWriter = new OutputStreamWriter(AHttpURLConnection.getOutputStream());
			AOutputStreamWriter.write(JSONValues);
			AOutputStreamWriter.close();
			AHttpURLConnection.getInputStream();
		}
		catch (IOException E)
		{
			Log.e(TAG, "Could not send synchronizer request", E);
		}

		return (null);
	}

	@Override
	protected void onPostExecute(Void Result)
	{
	}

	@Override
	protected void onPreExecute()
	{
	}

	@Override
	protected void onProgressUpdate(Void... Values)
	{
	}
}

