var Type;
(function (Type) {
    Type[Type["TV"] = 0] = "TV";
    Type[Type["OVA"] = 1] = "OVA";
    Type[Type["ONA"] = 2] = "ONA";
    Type[Type["Movie"] = 3] = "Movie";
    Type[Type["Special"] = 4] = "Special";
    Type[Type["Music"] = 5] = "Music";
})(Type || (Type = {}));
var Status;
(function (Status) {
    Status[Status["Finished_Airing"] = 0] = "Finished_Airing";
    Status[Status["Currently_Airing"] = 1] = "Currently_Airing";
    Status[Status["Not_Yet_Aired"] = 2] = "Not_Yet_Aired";
})(Status || (Status = {}));
var Rated;
(function (Rated) {
    Rated[Rated["G"] = 0] = "G";
    Rated[Rated["PG"] = 1] = "PG";
    Rated[Rated["PG_3"] = 2] = "PG_3";
    Rated[Rated["R_17"] = 3] = "R_17";
    Rated[Rated["R_plus"] = 4] = "R_plus";
    Rated[Rated["Rx"] = 5] = "Rx";
})(Rated || (Rated = {}));
var Season;
(function (Season) {
    Season[Season["Spring"] = 0] = "Spring";
    Season[Season["Summer"] = 1] = "Summer";
    Season[Season["Winter"] = 2] = "Winter";
    Season[Season["Fall"] = 3] = "Fall";
})(Season || (Season = {}));
var Quality;
(function (Quality) {
    Quality[Quality["AV"] = 0] = "AV";
    Quality[Quality["SD"] = 1] = "SD";
    Quality[Quality["HD"] = 2] = "HD";
    Quality[Quality["FHD"] = 3] = "FHD";
    Quality[Quality["UHD"] = 4] = "UHD";
})(Quality || (Quality = {}));
