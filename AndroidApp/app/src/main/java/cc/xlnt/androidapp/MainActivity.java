package cc.xlnt.androidapp;

import android.os.Bundle;
import android.os.StrictMode;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewTreeObserver;
import android.view.ViewTreeObserver.OnGlobalLayoutListener;
import android.widget.RelativeLayout;

import java.util.ArrayList;

import cc.xlnt.androidapp.Devices.DMXRGBLED;
import cc.xlnt.androidapp.Devices.Device;
import cc.xlnt.androidapp.Devices.Temperature;
import cc.xlnt.androidapp.Widgets.DeviceWidget;
import cc.xlnt.androidapp.Widgets.RGBWidget;
import cc.xlnt.androidapp.Widgets.TextWidget;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener, OnClickListener
{
	private static final String TAG = "MainActivity";
	public static MainActivity Self;

	public final ArrayList<DeviceWidget> Widgets = new ArrayList<DeviceWidget>();

	private static final int BUTTON_1 = 1;
	private static final int BUTTON_2 = 2;
	private static final int BUTTON_3 = 3;
	private static final int BUTTON_4 = 4;
	private static final int BUTTON_5 = 5;
	private static final int BUTTON_6 = 6;
	private static final int BUTTON_7 = 7;
	private static final int BUTTON_8 = 8;
	private static final int BUTTON_9 = 9;
	private static final int BUTTON_10 = 10;

	// Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG).setAction("Action", null).show();

	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

		if (android.os.Build.VERSION.SDK_INT > 9)
		{
			StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
			StrictMode.setThreadPolicy(policy);
		}

		setContentView(R.layout.activity_main);

		FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
		fab.setOnClickListener(new View.OnClickListener()
		{
			@Override
			public void onClick(View view)
			{
				DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
				drawer.openDrawer(Gravity.LEFT);
			}
		});

		NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
		navigationView.setNavigationItemSelectedListener(this);

		Self = this;

		Discoverer ADiscoverer = new Discoverer(getApplicationContext());
		ADiscoverer.execute();

		Downloader ADownloader = new Downloader();
		ADownloader.start();
	}

	@Override
	public void onClick(View v)
	{

	}

	@Override
	public void onBackPressed()
	{
		DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
		if (drawer.isDrawerOpen(GravityCompat.START))
		{
			drawer.closeDrawer(GravityCompat.START);
		}
		else
		{
			super.onBackPressed();
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	{
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item)
	{
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();

		//noinspection SimplifiableIfStatement
		if (id == R.id.action_settings)
		{
			return true;
		}

		return super.onOptionsItemSelected(item);
	}

	@SuppressWarnings("StatementWithEmptyBody")
	@Override
	public boolean onNavigationItemSelected(MenuItem item)
	{
		String Title = item.getTitle().toString();

		if (Title.compareTo("Refresh") != 0)
		{
			// Must add the progress bar to the root of the layout
			final RelativeLayout ARelativeLayout = (RelativeLayout) findViewById(R.id.content_main);

			ARelativeLayout.removeAllViews();
			Widgets.clear();

			Integer ID = 1;

			for (LometationDevice ALometationDevice : Discoverer.LometationDevices)
			{
				for (Device ADevice : ALometationDevice.Devices)
				{
					if (ADevice.Room.equals(Title))
					{
						Class DeviceClass = ADevice.getClass();
						if (DeviceClass == Temperature.class)
						{
							Temperature ATemperature = (Temperature) ADevice;
							String Celsius = String.valueOf(ATemperature.Celsius) + "°C";

							TextWidget ATextWidget = new TextWidget(ADevice, this, Celsius, R.drawable.temperature);
							Widgets.add(ATextWidget);
						}
						else if (DeviceClass == DMXRGBLED.class)
						{
							RGBWidget ARGBWidget = new RGBWidget(ADevice, this);
							Widgets.add(ARGBWidget);
						}
						else
						{
							TextWidget ATextWidget = new TextWidget(ADevice, this, ADevice.Name, R.drawable.ic_launcher);
							Widgets.add(ATextWidget);
						}
					}
				}
			}

			ViewTreeObserver AViewTreeObserver = ARelativeLayout.getViewTreeObserver();
			AViewTreeObserver.addOnGlobalLayoutListener(new OnGlobalLayoutListener()
			{
				@Override
				public void onGlobalLayout()
				{
					final int oneUnitWidth = ARelativeLayout.getMeasuredWidth() / 3 - 15;
					final int oneUnitHeight = ARelativeLayout.getMeasuredHeight() / 3 - 15;

					int Cell = 0, Row = 0;
					DeviceWidget LastView = null;
					for (DeviceWidget View : Widgets)
					{
						View.setOnClickListener(Self);

						RelativeLayout.LayoutParams LayoutParameter = new RelativeLayout.LayoutParams(oneUnitWidth, oneUnitHeight);
						if (LastView == null)
						{
							LayoutParameter.addRule(RelativeLayout.ALIGN_LEFT);
						}
						else
						{
							LayoutParameter.addRule(RelativeLayout.RIGHT_OF, LastView.getId());
						}
						LayoutParameter.setMargins(5, 5, Row * oneUnitHeight + 5, 5);
						View.setLayoutParams(LayoutParameter);

						if (Cell == 4)
						{
							Row++;
							Cell = 0;
						}
						else
						{
							Cell++;
						}

						LastView = View;
					}

					// Delete tree observer
					ViewTreeObserver obs = ARelativeLayout.getViewTreeObserver();
					obs.removeGlobalOnLayoutListener(this);
				}
			});

			for (DeviceWidget View : Widgets)
			{
				ARelativeLayout.addView(View);
			}

			DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
			drawer.closeDrawer(GravityCompat.START);
		}
		else
		{
			Discoverer ADiscoverer = new Discoverer(getApplicationContext());
			ADiscoverer.execute();
		}

		return true;
	}
}
