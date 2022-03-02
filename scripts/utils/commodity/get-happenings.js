import { getCommodity } from "./get-commodity";

const getEventTimeString = (start, end)=>{
    const startTime = start?.split('T')[1]?.split(':');
    const endTime = end?.split('T')[1]?.split(':');
    return startTime[0] + ':' + startTime[1] + ' - ' + endTime[0] + ':' + endTime[1];
}

const getEventDateObject = (date) => {
    const evDate = date.split(/[ T]+/)[0].split('-');
    return {
        day: evDate[2],
        month: evDate[1],
        year: evDate[0],
    };
}

const getId = (id, date)=>{
    return id + "dd"+ date.year + '_' + date.month + '_' + date.day;
}

const transformEvent = (event) => {
  const base_url = 'https://d1bnb47sm4re13.cloudfront.net/';

  //object destructuring
  const { id, isRecurrence, recurrenceDate } = event;
  const eventData = event.values.data;
  const { info, button_1, button_2, button_3, button_4, preset_timeline, preset_recurrence } = eventData;
  const { title, description } = info;
  
  // add action buttons
  const actions = [];
  if(button_1.url.length > 3 ) actions.push(button_1);
  if(button_2.url.length > 3 ) actions.push(button_2);
  if(button_3.url.length > 3 ) actions.push(button_3);
  if(button_4.url.length > 3 ) actions.push(button_4);

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
      //TODO: update date event here > start_date
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
const getAllCommodity = async (pageUid='', itemId='') => {
    let commodity = await getCommodity("78351230-3601-42c8-9b3e-a3a7f6179e45", pageUid, itemId);
    
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