package cc.xlnt.androidapp.Devices;

import cc.xlnt.androidapp.Uploader;

/**
 * Created by LeGone on 23.10.2016.
 */

public class DMXRGBLED extends Device
{
	public int R, G, B;

	@Override
	public void SendValues()
	{
		Uploader AUploader = new Uploader(this, "[{\"name\":\"" + Name + "\",\"room\":\"" + Room + "\",\"r\":" + R + ",\"g\":" + G + ",\"b\":" + B + "}]");
		AUploader.execute();
	}
}
