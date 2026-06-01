namespace NKPOS_V1.Helpers
{
    public static class GetMyanmarTime
    {
        public static string GetCurrentMyanmarTime()
        {
            var myanmarTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Myanmar Standard Time");
            var myanmarDateTime = TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.Local, myanmarTimeZone);

            return new DateTime(
                myanmarDateTime.Year,
                myanmarDateTime.Month,
                myanmarDateTime.Day,
                myanmarDateTime.Hour,
                myanmarDateTime.Minute,
                myanmarDateTime.Second
                ).ToString();
        }
    }
}
