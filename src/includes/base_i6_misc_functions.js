String.prototype.toUnderScore = function () {
  if (this.trim().length > 1) {
    return this.trim().split(" ").join("_");
  }
}

// capitalize first character of every word.. 
//'javaSCrIPT'.capitalize();     -> 'JavaSCrIPT'
//'javaSCrIPT'.capitalize(true); -> 'Javascript'
String.prototype.capitalize = function(lower) {
  if (this.trim().length > 1) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }
};

// capitalize first character of every word.. But also removes _ first.
// 'java_script'.labelize() -> 'Java Script'
// 'java script'.labelize() -> 'Java Script'
String.prototype.labelize = function() {
  if (this.trim().length > 1) {
    let _removed = this.replace(/_/g, ' ');
    return _removed.capitalize(true);
  }
}