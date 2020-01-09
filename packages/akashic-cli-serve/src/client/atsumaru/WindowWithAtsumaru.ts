import { RPGAtsumaruApi } from "./RPGAtsumaruApi";

export interface WindowWithAtsumaru extends Window {
	RPGAtsumaru: RPGAtsumaruApi;
}
