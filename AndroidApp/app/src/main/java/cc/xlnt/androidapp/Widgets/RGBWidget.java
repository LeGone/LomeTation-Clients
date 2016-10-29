package cc.xlnt.androidapp.Widgets;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.util.TypedValue;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import cc.xlnt.androidapp.Devices.DMXRGBLED;
import cc.xlnt.androidapp.Devices.Device;
import cc.xlnt.androidapp.R;

/**
 * Created by LeGone on 24.10.2016.
 */

public class RGBWidget extends DeviceWidget
{
	public RGBWidget(Device ADevice, Context AContext)
	{
		super(ADevice, AContext);

		ImageView AImageView = new ImageView(AContext);
		AImageView.setImageDrawable(getResources().getDrawable(R.drawable.light));
		AImageView.setColorFilter(FrontColor, PorterDuff.Mode.MULTIPLY);
		addView(AImageView);

		final Typeface Dincond = Typeface.createFromAsset(AContext.getAssets(), "DINCond-Regular.otf");
		LinearLayout ALinearLayout = new LinearLayout(AContext);
		ALinearLayout.setOrientation(LinearLayout.VERTICAL);

		TextView ATextView = new TextView(AContext);
		ATextView.setText(ADevice.Name);
		ATextView.setPadding(5, 0, 0, 0);
		ATextView.setTextColor(FrontColor);
		ATextView.setTypeface(Dincond);
		ATextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
		ALinearLayout.addView(ATextView);

		Spinner ASpinner = new Spinner(AContext);
		ASpinner.setAdapter(new RGBSpinnerAdapter(AContext));
		ASpinner.setSelection(0, false);

		ASpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
		{
			@Override
			public void onItemSelected(AdapterView<?> ParentView, View SelectedItemView, int Position, long ID)
			{
				RGBWidget Parent = (RGBWidget) ParentView.getParent().getParent();

				TextView ATextView = (TextView) SelectedItemView;

				ColorDrawable AColorDrawable = (ColorDrawable) ATextView.getBackground();
				int ColorCode = AColorDrawable.getColor();

				DMXRGBLED ColorDevice = (DMXRGBLED) Parent.ADevice;

				ColorDevice.R = (ColorCode >> 16) & 0xFF;
				ColorDevice.G = (ColorCode >> 8) & 0xFF;
				ColorDevice.B = (ColorCode >> 0) & 0xFF;

				ColorDevice.SendValues();
			}

			@Override
			public void onNothingSelected(AdapterView<?> parentView)
			{
			}
		});
		ALinearLayout.addView(ASpinner);

		addView(ALinearLayout);
	}

	@Override
	public void Refresh()
	{
	}
}