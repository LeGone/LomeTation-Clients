package cc.xlnt.androidapp.Widgets;

import android.content.Context;
import android.view.Gravity;
import android.widget.LinearLayout;

import cc.xlnt.androidapp.Devices.Device;
import cc.xlnt.androidapp.R;

/**
 * Created by LeGone on 24.10.2016.
 */

public class DeviceWidget extends LinearLayout
{
	public Device ADevice;
	final int FrontColor, BackColor;

	public DeviceWidget(Device ADevice, Context AContext)
	{
		super(AContext);

		this.ADevice = ADevice;
		ADevice.Widget = this;

		setGravity(Gravity.CENTER);
		setClickable(true);

		setId(generateViewId());

		FrontColor = getResources().getColor(R.color.colorAccent);
		BackColor = getResources().getColor(R.color.colorPrimaryDark);

		setBackgroundColor(BackColor);
	}

	public void Refresh()
	{
		throw new UnsupportedOperationException();
	}
}