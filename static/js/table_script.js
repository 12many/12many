/**
 * Created by zgraham on 4/26/17.
 */

$(document).ready(function() {
    console.log("just WORK");
    // sends get request thru ajax to send the info to the server without reloading the page

    $("#data_center_code").on("change", function() {
        // show spinner
        $("#load_spinner").show();
        dropInv();

        var status_ = $("#status_select").val();
        if (status_ == null)
            status_ = "";

        $.ajax({
            url: "hgroup?hostgroup=" + $("#data_center_code").val() + "&status=" + status_,
            method: "GET",
            dataType: "text",
            success: function(msg){
                searchInv(JSON.parse(msg), false);
            }
        });
    });

    $("#status_select").on("change", function() {
        // show spinner
        $("#load_spinner").show();
        dropInv();

        var status_ = $("#status_select").val();
        if (status_ == null)
            status_ = "";

        $.ajax({
            url: "hgroup?hostgroup=" + $("#data_center_code").val() + "&status=" + status_,
            method: "GET",
            dataType: "text",
            success: function(msg){
                searchInv(JSON.parse(msg), false);
            }
        });
    });

    $("#search_form").on("submit", function(e) {
        e.preventDefault();

        $("#load_spinner").show();

        // empty the table before we display it again with updated info
        dropInv();
        // set reset to true if button clicked is reset button
        var reset = (document.activeElement.getAttribute("id") == "reset");
        // use ajax to retrieve info from hgroup webpage(json.html)

        var status_ = $("#status_select").val();
        if (status_ == null)
            status_ = "";

        $.ajax({
            url: "hgroup?hostgroup=" + $("#data_center_code").val() + "&status=" + status_,
            method: "GET",
            dataType: "text",
            success: function (msg) {
                // search json data we received and display the fields that match user request
                searchInv(JSON.parse(msg), reset);
            }
        });
    });

    $('#search_form').submit();
});

function dropInv() {
    var inventory = $("#inventory");
    inventory.empty();
}

function searchInv(json, reset) {
    console.log("searchInv has been called");
    var spinner = $("#load_spinner");
    var inventory = $("#inventory");

    // empty table in inventory
    inventory.empty();

    var search_form = $("#search_form");
    var search_bar = $("#search_bar");
    var html_append = "";

    // check if reset is true, if it is then go through each input on the search form
    // and clear the value - after clearing, continue with rest of function to load table
    if (reset)
        search_bar.val("");


    var val = search_bar.val();
    var filter = val.toUpperCase();


    // loop thru starting from end, so that we can remove elements in the array safely
    for (var k = json.length - 1; k >= 0; k--) {
        // if the item is not located in the current element then remove that element

        // replace each null value with an empty string
        $.each(json[k], function(index,value) {
            if (value == null)
                json[k][index] = "";
        });

        if (val != "") {
            if (json[k]["fqdn"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["ip_address"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["mac_address"].toUpperCase().indexOf(filter) === -1 &&
                (json[k]["operating_system"] + " " + json[k]["operating_system_release"]).toUpperCase().indexOf(filter) === -1 &&
                json[k]["system_type"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["roles"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["product_name"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["serial_number"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["notes"].toUpperCase().indexOf(filter) === -1 &&
                json[k]["status"].toUpperCase().indexOf(filter) === -1) {
                json.splice(k, 1);
            }
        }
    }

    // go thru the elements in json that survived the filter
    // and append them to the table in table.html
    html_append += '<table id="inv_table" class="table table-bordered table-striped table-condensed table-hover tablesorter">';
    html_append += '<thead>';
    html_append += '<tr>';
    html_append += '<th>FQDN</th>';
    html_append += '<th>IP Address</th>';
    html_append += '<th>MAC</th>';
    html_append += '<th>OS</th>';
    html_append += '<th>Type</th>';
    html_append += '<th>Service</th>';
    html_append += '<th>Product</th>';
    html_append += '<th>Service Tag</th>';
    html_append += '<th>Notes</th>';
    html_append += '<th>Status</th>';
    html_append += '</tr>';
    html_append += '</thead>';
    html_append += '<tbody id="inventory">';
    $.each(json, function(i,k) {
        html_append += "<tr>";
        html_append += "<td>" + k["fqdn"] + "</td>";
        html_append += "<td>" + k["ip_address"] + "</td>";
        html_append += "<td>" + k["mac_address"] + "</td>";
        html_append += "<td>" + k["operating_system"] + " " + k["operating_system_release"] + "</td>";
        html_append += "<td>" + k["system_type"] + "</td>";

        html_append += "<td>";
        var roles = k["roles"].split(",");
        var role_len = roles.length;
        for (var j = 0; j < role_len; j++) {
            html_append += roles[j] + (j!=role_len-1 ? ", " : "");
        }
        html_append += "</td>";
        // End of service logic

        if (k["product_name"] == null) {k["product_name"] = "";}
        html_append += "<td>" + k["product_name"] + "</td>";

        if (k["serial_number"] == null) {k["serial_number"] = "";}
        html_append += "<td>" + k["serial_number"] + "</td>";

        if (k["notes"] == null) {k["notes"] = "";}
        html_append += "<td>" + k["notes"] + "</td>";

        html_append += "<td>" + k["status"] + "</td>";
        html_append += "</tr>";
    });
    html_append += '</tbody>';
    html_append += '</table>';

    // append html table data onto the tbody in table.html
    inventory.append(html_append);


    // sort the new output
    $("#inv_table").tablesorter();

    // Hide spinner
    spinner.hide();
}