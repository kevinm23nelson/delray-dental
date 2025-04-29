import { NextResponse } from "next/server";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { parseISO, format } from "date-fns";

const TIMEZONE = "America/New_York"; // Eastern Time

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Please provide a date parameter in ISO format" },
        { status: 400 }
      );
    }

    // Parse the input date (can be in any timezone)
    const inputDate = parseISO(dateStr);

    // Convert to Eastern Time
    const dateET = toZonedTime(inputDate, TIMEZONE);

    // Format for display
    const displayTimeET = formatInTimeZone(
      inputDate,
      TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx (EEEE h:mm a)"
    );

    // Also convert back to UTC for storage
    const utcTimeForStorage = formatInTimeZone(
      dateET,
      "UTC",
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );

    // Parse the UTC time string back into a Date object
    const parsedUtcTime = parseISO(utcTimeForStorage);

    return NextResponse.json({
      input: {
        dateString: dateStr,
        parsedAsUTC: inputDate.toISOString(),
      },
      easternTime: {
        dateObject: dateET.toString(),
        formatted: format(dateET, "yyyy-MM-dd HH:mm:ss"),
        display: displayTimeET,
      },
      utcForStorage: {
        formatted: utcTimeForStorage,
        parsed: parsedUtcTime.toISOString(),
      },
      verification: {
        // Convert the stored UTC time back to Eastern for display
        storedUtcDisplayedInET: formatInTimeZone(
          parsedUtcTime,
          TIMEZONE,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx (EEEE h:mm a)"
        ),
      },
    });
  } catch (error) {
    console.error("Debug timezone error:", error);
    return NextResponse.json(
      {
        error: "Failed to process date",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
