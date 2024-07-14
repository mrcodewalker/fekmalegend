import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroments/enviroment";
import {Observable} from "rxjs";
import {Event} from "../models/event";


@Injectable({
  providedIn: 'root'
})
export class EventService{

get(): Promise<Event[]> {
  return Promise.resolve([
    { id: 1, start_date: "2024-05-04 9:00", end_date: "2024-05-04 13:00", text: "Event 1" } as Event,
    { id: 2, start_date: "2024-05-09 9:00", end_date: "2024-05-09 13:00", text: "Event 2" } as Event
  ]);
}

}
