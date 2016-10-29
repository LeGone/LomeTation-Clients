package cc.xlnt.androidapp.Widgets;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.util.TypedValue;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import cc.xlnt.androidapp.Devices.Device;
import cc.xlnt.androidapp.Devices.Temperature;

public class TextWidget extends DeviceWidget
{
	public ImageView AImageView;
	public TextView ATextView;

	public TextWidget(Device ADevice, Context AContext, String Value, int IconID)
	{
		super(ADevice, AContext);

		AImageView = new ImageView(AContext);
		AImageView.setImageDrawable(getResources().getDrawable(IconID));
		AImageView.setColorFilter(FrontColor, PorterDuff.Mode.MULTIPLY);
		addView(AImageView);

		final Typeface Dincond = Typeface.createFromAsset(AContext.getAssets(), "DINCond-Regular.otf");
		LinearLayout ALinearLayout = new LinearLayout(AContext);
		ALinearLayout.setOrientation(LinearLayout.VERTICAL);

		ATextView = new TextView(AContext);
		ATextView.setText(ADevice.Name);
		ATextView.setPadding(5, 0, 0, 0);
		ATextView.setTextColor(FrontColor);
		ATextView.setTypeface(Dincond);
		ATextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
		ALinearLayout.addView(ATextView);

		ATextView = new TextView(AContext);
		ATextView.setText(Value);
		ATextView.setPadding(5, 0, 0, 0);
		ATextView.setTextColor(FrontColor);
		ATextView.setTypeface(Dincond);
		ATextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 32);
		ALinearLayout.addView(ATextView);

		addView(ALinearLayout);
	}

	@Override
	public void Refresh()
	{
		if (ADevice.getClass() == Temperature.class)
		{
			Temperature ATemperature = (Temperature) ADevice;
			ATextView.setText(String.valueOf(ATemperature.Celsius) + "°C");
		}
	}
}