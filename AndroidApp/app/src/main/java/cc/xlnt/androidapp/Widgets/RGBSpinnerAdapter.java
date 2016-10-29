package cc.xlnt.androidapp.Widgets;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import static cc.xlnt.androidapp.R.array.colors;
import static cc.xlnt.androidapp.R.array.colorNames;

/**
 * Created by LeGone on 24.10.2016.
 */

public class RGBSpinnerAdapter extends BaseAdapter
{
	ArrayList<Integer> Colors;
	ArrayList<String> ColorNames;
	Context Context;

	public RGBSpinnerAdapter(Context AContext)
	{
		this.Context = AContext;

		Colors = new ArrayList<Integer>();
		int IntArray[] = Context.getResources().getIntArray(colors);
		for (int Element:IntArray)
		{
			Colors.add(Element);
		}

		ColorNames = new ArrayList<String>();
		String StringArray[] = Context.getResources().getStringArray(colorNames);
		for (String Element:StringArray)
		{
			ColorNames.add(Element);
		}
	}

	@Override
	public int getCount()
	{
		return Colors.size();
	}

	@Override
	public Object getItem(int arg0)
	{
		return Colors.get(arg0);
	}

	@Override
	public long getItemId(int arg0)
	{
		return arg0;
	}

	@Override
	public View getView(int pos, View view, ViewGroup parent)
	{
		LayoutInflater inflater=LayoutInflater.from(Context);
		view=inflater.inflate(android.R.layout.simple_spinner_dropdown_item, null);
		TextView txv=(TextView)view.findViewById(android.R.id.text1);
		txv.setBackgroundColor(Colors.get(pos));
		txv.setTextSize(20f);
		txv.setText(ColorNames.get(pos));
		return view;
	}
}