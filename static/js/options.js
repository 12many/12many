/**
 * Created by zgraham on 5/3/17.
 */

$(document).ready(function() {

    /* "value" : "display" */

    var data_centers = {
        "arc_export_mark": "MARK (export)" ,
        "arc_export_bra": "BRA (export)",
        "arc_export_fra" : "FRA (export)",
        "arc_export_at1" : "AT1 (export)",
        "arc_export_us" : "SC4 (export)",
        "arc_export_fsc4" : "FSC4 (export)",
        "arc_import_mark" : "MARK (import)",
        "arc_import_fra" : "FRA (import)",
        "arc_import_us" : "SC4 (import)",
        "arc_import_fsc4" : "FSC4 (import)"
    };

    var statuses = {
        "" : "All Statuses",
        "production" : "Production",
        "allocated" : "Allocated",
        "decommissioned" : "Decommissioned",
        "deployment" : "Deployment",
        "disposed" : "Disposed",
        "idle" : "Idle",
        "in transit" : "In Transit"
    };

    $.each(data_centers, function(val, text) {
        $("#data_center_code").append($('<option></option>').val(val).html(text));
    });

    $.each(statuses, function(val, text) {
        $("#status_select").append($('<option></option>').val(val).html(text));
    });
});
