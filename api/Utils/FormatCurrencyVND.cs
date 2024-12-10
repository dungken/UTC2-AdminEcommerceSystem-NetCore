using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;

namespace api.Utils
{
    public static class FormatCurrencyVND
    {

        public static string FormatToVND(decimal amount)
        {
            CultureInfo culture = new CultureInfo("vi-VN");
            return string.Format(culture, "{0:C0}", amount).Replace("₫", "đồng");
        }

    }
}