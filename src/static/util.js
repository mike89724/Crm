export default (function() {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
      // If the exp is undefined or zero...
      if (typeof exp === "undefined" || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split("e");
      value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
      // Shift back
      value = value.toString().split("e");
      return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
    }
  
    // Decimal round
    if (!Math.round10) {
      Math.round10 = function(value, exp) {
        return decimalAdjust("round", value, exp);
      };
    }
    // Decimal floor
    if (!Math.floor10) {
      Math.floor10 = function(value, exp) {
        return decimalAdjust("floor", value, exp);
      };
    }
    // Decimal ceil
    if (!Math.ceil10) {
      Math.ceil10 = function(value, exp) {
        return decimalAdjust("ceil", value, exp);
      };
    }
  })();

  export function formatDate(date_variable) {
    let now = new Date();
    let current_date_data = new Date(date_variable);
    const oneDay = 60 * 60 * 24 * 1000;

    var differenceDates = now - current_date_data;
    var compareDatesBoolean = (now - current_date_data) < oneDay;

    var convertDate = null;
    if(compareDatesBoolean && differenceDates < 60000) {
      convertDate = differenceDates / 1000; //
      return Math.trunc(convertDate) + " sec ago";
      //less than 60 seconds ago
    } else if(compareDatesBoolean && differenceDates >= 60000 && differenceDates < 3600000) {
      convertDate = differenceDates / (60*1000); //
      return Math.trunc(convertDate) + " min ago";
      // less than 60 minutes ago
    } else if(compareDatesBoolean && differenceDates >= 3600000 && differenceDates < 86400000) {
      convertDate = differenceDates / (60*60*1000); //
      return Math.trunc(convertDate) + " hr ago";
      // less than 24 hours ago
    } else {
      //let it be
      let za = new Date(current_date_data);
      let zaR = za.getUTCFullYear();
      let zaMth = za.getUTCMonth();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      zaMth = monthNames[zaMth];
      let zaDs = za.getUTCDate();
      //let zaTm = za.toTimeString().substr(0,5);

      return (zaDs + " " + zaMth + " " + zaR);
    }
  }
  export function getVersionCode(){
    return 26;
  }