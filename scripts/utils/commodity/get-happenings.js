import { getCommodity } from "./get-commodity";
import { HAPPENINGS_COMMODITY_ID } from "../../../components/lib/constants";

const getEventTimeString = (start, end)=>{
    const startTime = start?.split(', ')[1].split(" ");
    console.log('start', end);
    const endTime = end?.split(', ')[1].split(" ");
    return startTime[0].split(':')[0] + ':' + startTime[0].split(':')[1] + ' ' +startTime[1] + ' - ' + endTime[0].split(':')[0] + ':' + endTime[0].split(':')[1] + ' ' + endTime[1];
}

const getEventDateObject = (date) => {
    const evDate = date.split(',')[0].split('/');
    return {
        day: evDate[1],
        month: evDate[0],
        year: evDate[2],
    };
}

const getId = (id, date)=>{
    return id + "__dd"+ date.year + '_' + date.month + '_' + date.day;
}

const transformEvent = (event) => {
  const base_url = 'https://d1bnb47sm4re13.cloudfront.net/';

  //object destructuring
  const { id, isRecurrence, recurrenceDate } = event;
  const eventData = event.values.data;
  const { info, buttons, preset_timeline, preset_recurrence } = eventData;
  const { title, description } = info;

  // add action buttons
  const actions = [];
  if(buttons.length > 0) {
      buttons.forEach((button) => {
            const { label, url } = button;
            actions.push(button);
      });
  }

  // add image
  let image = eventData.image.image[0];
  image = base_url + image.substring(42, image.length - 4).replace("/upload/", "/resized/") + '_600' + image.substring(image.length - 4, image.length);

  if(isRecurrence) {
    let res = [];
    const {start_time, end_time} = preset_recurrence;
    const time = getEventTimeString(start_time, end_time);
    recurrenceDate.forEach((dateObj) => { 
        const date = getEventDateObject(dateObj);
        const evObj = {id: getId(id, date), date, time, image, title, description, actions}
        res.push(evObj);
    });
    return res;
  }else{
      const {start_date, start_time, end_time} = preset_timeline;
      const date = getEventDateObject(start_date);
      const time = getEventTimeString(start_time, end_time);
      return [{id: getId(id, date), date, time, image, title, description, actions}];
  }
};

/**
 * 
 * @param {*} pageName 
 * @returns 
 */
const getAllCommodity = async (pageUid = "", itemId = "") => {
    let commodity = await getCommodity(HAPPENINGS_COMMODITY_ID, pageUid, itemId);
    
    let getData =
        commodity.data.allCommodity.edges[0].node.commodityitemSet.edges;
    let events = [];

    getData.forEach((item) => {
      if(item.node.values.data.isOnline)
      events.push(...transformEvent(item.node));
    });
    
    return events;
};

export {
    getAllCommodity
}