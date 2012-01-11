/*
Copyright (c) 2008-2011, www.redips.net All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/drag-and-drop-table-content/
Version 4.6.6
Jan 11, 2012.
*/
"use strict";var REDIPS=REDIPS||{};REDIPS.drag=(function(){var init,init_tables,enable_drag,enable_table,img_onmousemove,handler_onmousedown,handler_ondblclick,table_top,handler_onmouseup,handler_onmousemove,element_drop,element_deleted,cell_changed,handler_onresize,set_trc,set_position,setTdStyle,getTdStyle,box_offset,calculate_cells,getScrollPosition,autoscrollX,autoscrollY,clone_div,copy_properties,clone_limit,elementControl,get_style,find_parent,find_cell,save_content,relocate,empty_cell,shift_cells,move_object,delete_object,animation,get_table_index,get_position,row_opacity,row_empty,row_clone,row_drop,form_elements,normalize,has_childs,obj_margin=null,window_width=0,window_height=0,scroll_width=null,scroll_height=null,edge={page:{x:0,y:0},div:{x:0,y:0},flag:{x:0,y:0}},scroll_object,bgstyle_old,scrollable_container=[],tables=[],sort_idx,moved,cloned,cloned_id=[],currentCell=[],div_drag=null,div_box=null,pointer={x:0,y:0},threshold={x:0,y:0,value:7,flag:false},shift_key=false,clone_class=false,table=null,table_old=null,table_source=null,row=null,row_old=null,row_source=null,cell=null,cell_old=null,cell_source=null,obj=false,obj_old=false,mode='cell',hover={color_td:'#E7AB83',color_tr:'#E7AB83'},bound=25,speed=20,only={div:[],cname:'only',other:'deny'},mark={action:'deny',cname:'mark',exception:[]},border='solid',border_disabled='dotted',opacity_disabled,trash_cname='trash',trash_ask=true,trash_ask_row=true,drop_option='multiple',shift_option='horizontal1',multiple_drop='bottom',delete_cloned=true,delete_shifted=false,source_cell=null,current_cell=null,previous_cell=null,target_cell=null,animation_pause=20,animation_step=2,animation_shift=false,shift_after=true,an_counter=0,clone_shiftKey=false,clone_shiftKey_row=false,row_empty_color='White';init=function(dc){var self=this,i,imgs,redips_clone;if(dc===undefined){dc='drag';}
div_drag=document.getElementById(dc);if(!document.getElementById('redips_clone')){redips_clone=document.createElement('div');redips_clone.id='redips_clone';redips_clone.style.width=redips_clone.style.height='1px';div_drag.appendChild(redips_clone);}
enable_drag('init');init_tables();handler_onresize();REDIPS.event.add(window,'resize',handler_onresize);imgs=div_drag.getElementsByTagName('img');for(i=0;i<imgs.length;i++){REDIPS.event.add(imgs[i],'mousemove',img_onmousemove);REDIPS.event.add(imgs[i],'touchmove',img_onmousemove);}
REDIPS.event.add(window,'scroll',calculate_cells);};img_onmousemove=function(){return false;};init_tables=function(){var i,j,k,element,level,group_idx,tables_nodeList,nested_tables,td,rowspan;tables_nodeList=div_drag.getElementsByTagName('table');for(i=0,j=0;i<tables_nodeList.length;i++){if(tables_nodeList[i].parentNode.id==='redips_clone'||tables_nodeList[i].className.indexOf('nolayout')>-1){continue;}
element=tables_nodeList[i].parentNode;level=0;do{if(element.nodeName==='TD'){level++;}
element=element.parentNode;}while(element&&element!==div_drag);tables[j]=tables_nodeList[i];if(!tables[j].redips){tables[j].redips={};}
tables[j].redips.container=div_drag;tables[j].redips.nestedLevel=level;tables[j].redips.idx=j;td=tables[j].getElementsByTagName('td');for(k=0,rowspan=false;k<td.length;k++){if(td[k].rowSpan>1){rowspan=true;break;}}
tables[j].redips.rowspan=rowspan;j++;}
for(i=0,group_idx=sort_idx=1;i<tables.length;i++){if(tables[i].redips.nestedLevel===0){tables[i].redips.nestedGroup=group_idx;tables[i].redips.sort=sort_idx*100;nested_tables=tables[i].getElementsByTagName('table');for(j=0;j<nested_tables.length;j++){if(nested_tables[j].className.indexOf('nolayout')>-1){continue;}
nested_tables[j].redips.nestedGroup=group_idx;nested_tables[j].redips.sort=sort_idx*100+nested_tables[j].redips.nestedLevel;}
group_idx++;sort_idx++;}}};handler_onmousedown=function(e){var evt=e||window.event,offset,mouseButton,position,X,Y;if(this.redips.animated===true){return true;}
evt.cancelBubble=true;if(evt.stopPropagation){evt.stopPropagation();}
shift_key=evt.shiftKey;if(evt.which){mouseButton=evt.which;}
else{mouseButton=evt.button;}
if(elementControl(evt)||(!evt.touches&&mouseButton!==1)){return true;}
if(window.getSelection){window.getSelection().removeAllRanges();}
else if(document.selection&&document.selection.type==="Text"){try{document.selection.empty();}
catch(error){}}
if(evt.touches){X=pointer.x=evt.touches[0].clientX;Y=pointer.y=evt.touches[0].clientY;}
else{X=pointer.x=evt.clientX;Y=pointer.y=evt.clientY;}
threshold.x=X;threshold.y=Y;threshold.flag=false;REDIPS.drag.obj_old=obj_old=obj||this;REDIPS.drag.obj=obj=this;clone_class=obj.className.indexOf('clone')>-1?true:false;table_top(obj);if(div_drag!==obj.redips.container){div_drag=obj.redips.container;init_tables();}
if(obj.className.indexOf('row')===-1){REDIPS.drag.mode=mode='cell';}
else{REDIPS.drag.mode=mode='row';REDIPS.drag.obj=obj=row_clone(obj);}
calculate_cells();if(!clone_class&&mode==='cell'){obj.style.zIndex=999;}
table=row=cell=null;set_trc();table_source=table_old=table;row_source=row_old=row;cell_source=cell_old=cell;REDIPS.drag.source_cell=source_cell=find_parent('TD',obj);REDIPS.drag.current_cell=current_cell=source_cell;REDIPS.drag.previous_cell=previous_cell=source_cell;if(mode==='cell'){REDIPS.drag.myhandler_clicked(current_cell);}
else{REDIPS.drag.myhandler_row_clicked(current_cell);}
if(table===null||row===null||cell===null){set_trc();table_source=table_old=table;row_source=row_old=row;cell_source=cell_old=cell;if(table===null||row===null||cell===null){return true;}}
moved=cloned=false;REDIPS.event.add(document,'mousemove',handler_onmousemove);REDIPS.event.add(document,'touchmove',handler_onmousemove);REDIPS.event.add(document,'mouseup',handler_onmouseup);REDIPS.event.add(document,'touchend',handler_onmouseup);if(obj.setCapture){obj.setCapture();}
if(table!==null&&row!==null&&cell!==null){bgstyle_old=getTdStyle(table,row,cell);}
position=get_style(tables[table_source],'position');if(position!=='fixed'){position=get_style(tables[table_source].parentNode,'position');}
offset=box_offset(obj,position);obj_margin=[Y-offset[0],offset[1]-X,offset[2]-Y,X-offset[3]];div_drag.onselectstart=function(e){evt=e||window.event;if(!elementControl(evt)){if(evt.shiftKey){document.selection.clear();}
return false;}};return false;};handler_ondblclick=function(e){REDIPS.drag.myhandler_dblclicked();};table_top=function(obj){var e,i,tmp,group;e=find_parent('TABLE',obj.parentNode);group=e.redips.nestedGroup;for(i=0;i<tables.length;i++){if(tables[i].redips.nestedGroup===group){tables[i].redips.sort=sort_idx*100+tables[i].redips.nestedLevel;}}
tables.sort(function(a,b){return b.redips.sort-a.redips.sort;});sort_idx++;};row_clone=function(el){var table_mini,offset,row_obj,last_idx,empty_row=true,cr,div,i,j;if(el.nodeName==='DIV'){div=el;el=find_parent('TR',el);if(el.redips===undefined){el.redips={};}
el.redips.div=div;return el;}
else{row_obj=el;if(row_obj.redips===undefined){row_obj.redips={};}
el=find_parent('TABLE',el);if(clone_class&&cloned){div=row_obj.redips.div;div.className=normalize(div.className.replace('clone',''));}
table_mini=el.cloneNode(true);if(clone_class&&cloned){div.className=div.className+' clone';}
last_idx=table_mini.rows.length-1;for(i=last_idx;i>=0;i--){if(i!==row_obj.rowIndex){if(empty_row===true){cr=table_mini.rows[i];for(j=0;j<cr.cells.length;j++){if(cr.cells[j].className.indexOf('rowhandler')>-1){empty_row=false;break;}}}
table_mini.deleteRow(i);}}
if(!cloned){row_obj.redips.empty_row=empty_row;}
table_mini.redips={};table_mini.redips.container=el.redips.container;table_mini.redips.source_row=row_obj;form_elements(row_obj,table_mini.rows[0]);copy_properties(row_obj,table_mini.rows[0]);document.getElementById('redips_clone').appendChild(table_mini);offset=box_offset(row_obj,'fixed');table_mini.style.position='fixed';table_mini.style.top=offset[0]+"px";table_mini.style.left=offset[3]+"px";table_mini.style.width=(offset[1]-offset[3])+"px";return table_mini;}};row_drop=function(r_table,r_row,table_mini){var tbl=tables[r_table],ts=tbl.rows[0].parentNode,animated=false,tr,rp,src,rowIndex,delete_srow,drop;delete_srow=function(){if(!animated&&obj_old.redips.empty_row){row_opacity(obj_old,'empty',REDIPS.drag.row_empty_color);}
else{src=find_parent('TABLE',src);src.deleteRow(rowIndex);}};if(table_mini===undefined){table_mini=obj;}
else{animated=true;}
src=table_mini.redips.source_row;rowIndex=src.rowIndex;tr=table_mini.getElementsByTagName('tr')[0];table_mini.parentNode.removeChild(table_mini);drop=REDIPS.drag.myhandler_row_dropped_before(rowIndex);if(drop!==false){if(!animated&&target_cell.className.indexOf(REDIPS.drag.trash_cname)>-1){if(cloned){REDIPS.drag.myhandler_row_deleted();}
else{if(REDIPS.drag.trash_ask_row){if(confirm('Are you sure you want to delete row?')){delete_srow();REDIPS.drag.myhandler_row_deleted();}
else{delete obj_old.redips.empty_row;REDIPS.drag.myhandler_row_undeleted();}}
else{delete_srow();REDIPS.drag.myhandler_row_deleted();}}}
else{if(animated||!cloned){delete_srow();}
if(r_row<tbl.rows.length){ts.insertBefore(tr,tbl.rows[r_row]);rp=tbl.rows[r_row+1].redips;if(rp&&rp.empty_row){ts.deleteRow(r_row+1);}}
else{ts.appendChild(tr);}
delete tr.redips.empty_row;if(!animated){REDIPS.drag.myhandler_row_dropped(target_cell);}}
if(tr.getElementsByTagName('table').length>0){init_tables();}}
else{}};form_elements=function(str,ctr){var i,j,k,type,src=[],cld=[];src[0]=str.getElementsByTagName('input');src[1]=str.getElementsByTagName('textarea');src[2]=str.getElementsByTagName('select');cld[0]=ctr.getElementsByTagName('input');cld[1]=ctr.getElementsByTagName('textarea');cld[2]=ctr.getElementsByTagName('select');for(i=0;i<src.length;i++){for(j=0;j<src[i].length;j++){type=src[i][j].type;switch(type){case'text':case'textarea':case'password':cld[i][j].value=src[i][j].value;break;case'radio':case'checkbox':cld[i][j].checked=src[i][j].checked;break;case'select-one':cld[i][j].selectedIndex=src[i][j].selectedIndex;break;case'select-multiple':for(k=0;k<src[i][j].options.length;k++){cld[i][j].options[k].selected=src[i][j].options[k].selected;}
break;}}}};handler_onmouseup=function(e){var evt=e||window.event,target_table,r_table,r_row,mt_tr,X,Y,i,target_elements,target_elements_length;X=evt.clientX;Y=evt.clientY;edge.flag.x=edge.flag.y=0;if(obj.releaseCapture){obj.releaseCapture();}
REDIPS.event.remove(document,'mousemove',handler_onmousemove);REDIPS.event.remove(document,'touchmove',handler_onmousemove);REDIPS.event.remove(document,'mouseup',handler_onmouseup);REDIPS.event.remove(document,'touchend',handler_onmouseup);div_drag.onselectstart=null;obj.style.left=0;obj.style.top=0;obj.style.zIndex=-1;obj.style.position='static';scroll_width=document.documentElement.scrollWidth;scroll_height=document.documentElement.scrollHeight;edge.flag.x=edge.flag.y=0;if(cloned&&mode==='cell'&&(table===null||row===null||cell===null)){obj.parentNode.removeChild(obj);cloned_id[obj_old.id]-=1;REDIPS.drag.myhandler_notcloned();}
else if(table===null||row===null||cell===null){REDIPS.drag.myhandler_notmoved();}
else{if(table<tables.length){target_table=tables[table];REDIPS.drag.target_cell=target_cell=target_table.rows[row].cells[cell];setTdStyle(table,row,cell,bgstyle_old);r_table=table;r_row=row;}
else if(table_old===null||row_old===null||cell_old===null){target_table=tables[table_source];REDIPS.drag.target_cell=target_cell=target_table.rows[row_source].cells[cell_source];setTdStyle(table_source,row_source,cell_source,bgstyle_old);r_table=table_source;r_row=row_source;}
else{target_table=tables[table_old];REDIPS.drag.target_cell=target_cell=target_table.rows[row_old].cells[cell_old];setTdStyle(table_old,row_old,cell_old,bgstyle_old);r_table=table_old;r_row=row_old;}
if(mode==='row'){if(!moved){REDIPS.drag.myhandler_row_notmoved();}
else{if(table_source===r_table&&row_source===r_row){mt_tr=obj.getElementsByTagName('tr')[0];obj_old.style.backgroundColor=mt_tr.style.backgroundColor;for(i=0;i<mt_tr.cells.length;i++){obj_old.cells[i].style.backgroundColor=mt_tr.cells[i].style.backgroundColor;}
obj.parentNode.removeChild(obj);delete obj_old.redips.empty_row;if(cloned){REDIPS.drag.myhandler_row_notcloned();}
else{REDIPS.drag.myhandler_row_dropped_source(target_cell);}}
else{row_drop(r_table,r_row);}}}
else if(!cloned&&!threshold.flag){REDIPS.drag.myhandler_notmoved();}
else if(cloned&&table_source===table&&row_source===row&&cell_source===cell){obj.parentNode.removeChild(obj);cloned_id[obj_old.id]-=1;REDIPS.drag.myhandler_notcloned();}
else if(cloned&&REDIPS.drag.delete_cloned===true&&(X<target_table.redips.offset[3]||X>target_table.redips.offset[1]||Y<target_table.redips.offset[0]||Y>target_table.redips.offset[2])){obj.parentNode.removeChild(obj);cloned_id[obj_old.id]-=1;REDIPS.drag.myhandler_notcloned();}
else if(target_cell.className.indexOf(REDIPS.drag.trash_cname)>-1){obj.parentNode.removeChild(obj);if(REDIPS.drag.trash_ask){setTimeout(function(){if(confirm('Are you sure you want to delete?')){element_deleted();}
else{if(!cloned){tables[table_source].rows[row_source].cells[cell_source].appendChild(obj);calculate_cells();}
REDIPS.drag.myhandler_undeleted();}},20);}
else{element_deleted();}}
else if(REDIPS.drag.drop_option==='switch'){obj.parentNode.removeChild(obj);target_elements=target_cell.getElementsByTagName('div');target_elements_length=target_elements.length;for(i=0;i<target_elements_length;i++){if(target_elements[0]!==undefined){REDIPS.drag.obj_old=target_elements[0];source_cell.appendChild(target_elements[0]);}}
element_drop();if(target_elements_length){REDIPS.drag.myhandler_switched();}}
else if(REDIPS.drag.drop_option==='overwrite'){empty_cell(target_cell);element_drop();}
else{element_drop();}
if(mode==='cell'&&obj.getElementsByTagName('table').length>0){init_tables();}
calculate_cells();}
table_old=row_old=cell_old=null;};element_drop=function(){var drop=REDIPS.drag.myhandler_dropped_before(target_cell);if(drop!==false){if(REDIPS.drag.drop_option==='shift'&&has_childs(target_cell)){shift_cells(source_cell,target_cell);}
if(REDIPS.drag.multiple_drop==='top'&&target_cell.hasChildNodes()){target_cell.insertBefore(obj,target_cell.firstChild);}
else{target_cell.appendChild(obj);}
REDIPS.drag.myhandler_dropped(target_cell);if(cloned){REDIPS.drag.myhandler_cloned_dropped(target_cell);clone_limit();}}
else if(cloned){obj.parentNode.removeChild(obj);}};element_deleted=function(){var param;REDIPS.drag.myhandler_deleted();if(cloned){clone_limit();}
if(REDIPS.drag.drop_option==='shift'&&REDIPS.drag.shift_after){switch(REDIPS.drag.shift_option){case'vertical2':param='lastInColumn';break;case'horizontal2':param='lastInRow';break;default:param='last';}
shift_cells(source_cell,find_cell(param,source_cell)[2]);}};handler_onmousemove=function(e){var evt=e||window.event,bound=REDIPS.drag.bound,sca,X,Y,deltaX,deltaY,i,scrollPosition;if(evt.touches){X=pointer.x=evt.touches[0].clientX;Y=pointer.y=evt.touches[0].clientY;}
else{X=pointer.x=evt.clientX;Y=pointer.y=evt.clientY;}
deltaX=Math.abs(threshold.x-X);deltaY=Math.abs(threshold.y-Y);if(!moved){if(mode==='cell'&&(clone_class||(REDIPS.drag.clone_shiftKey===true&&shift_key))){REDIPS.drag.obj_old=obj_old=obj;REDIPS.drag.obj=obj=clone_div(obj,true);cloned=true;REDIPS.drag.myhandler_cloned();set_position();}
else{if(mode==='row'){if(clone_class||(REDIPS.drag.clone_shiftKey_row===true&&shift_key)){cloned=true;}
REDIPS.drag.obj_old=obj_old=obj;REDIPS.drag.obj=obj=row_clone(obj);obj.style.zIndex=999;}
if(obj.setCapture){obj.setCapture();}
obj.style.position='fixed';calculate_cells();set_trc();if(mode==='row'){if(cloned){REDIPS.drag.myhandler_row_cloned();}
else{REDIPS.drag.myhandler_row_moved();}}
set_position();}
if(X>window_width-obj_margin[1]){obj.style.left=(window_width-(obj_margin[1]+obj_margin[3]))+'px';}
if(Y>window_height-obj_margin[2]){obj.style.top=(window_height-(obj_margin[0]+obj_margin[2]))+'px';}}
moved=true;if(mode==='cell'&&(deltaX>threshold.value||deltaY>threshold.value)&&!threshold.flag){threshold.flag=true;set_position();REDIPS.drag.myhandler_moved();}
if(X>obj_margin[3]&&X<window_width-obj_margin[1]){obj.style.left=(X-obj_margin[3])+'px';}
if(Y>obj_margin[0]&&Y<window_height-obj_margin[2]){obj.style.top=(Y-obj_margin[0])+'px';}
if(X<div_box[1]&&X>div_box[3]&&Y<div_box[2]&&Y>div_box[0]&&edge.flag.x===0&&edge.flag.y===0&&(currentCell.containTable||(X<currentCell[3]||X>currentCell[1]||Y<currentCell[0]||Y>currentCell[2]))){set_trc();cell_changed();}
edge.page.x=bound-(window_width/2>X?X-obj_margin[3]:window_width-X-obj_margin[1]);if(edge.page.x>0){if(edge.page.x>bound){edge.page.x=bound;}
scrollPosition=getScrollPosition()[0];edge.page.x*=X<window_width/2?-1:1;if(!((edge.page.x<0&&scrollPosition<=0)||(edge.page.x>0&&scrollPosition>=(scroll_width-window_width)))){if(edge.flag.x++===0){REDIPS.event.remove(window,'scroll',calculate_cells);autoscrollX(window);}}}
else{edge.page.x=0;}
edge.page.y=bound-(window_height/2>Y?Y-obj_margin[0]:window_height-Y-obj_margin[2]);if(edge.page.y>0){if(edge.page.y>bound){edge.page.y=bound;}
scrollPosition=getScrollPosition()[1];edge.page.y*=Y<window_height/2?-1:1;if(!((edge.page.y<0&&scrollPosition<=0)||(edge.page.y>0&&scrollPosition>=(scroll_height-window_height)))){if(edge.flag.y++===0){REDIPS.event.remove(window,'scroll',calculate_cells);autoscrollY(window);}}}
else{edge.page.y=0;}
for(i=0;i<scrollable_container.length;i++){sca=scrollable_container[i];if(sca.autoscroll&&X<sca.offset[1]&&X>sca.offset[3]&&Y<sca.offset[2]&&Y>sca.offset[0]){edge.div.x=bound-(sca.midstX>X?X-obj_margin[3]-sca.offset[3]:sca.offset[1]-X-obj_margin[1]);if(edge.div.x>0){if(edge.div.x>bound){edge.div.x=bound;}
edge.div.x*=X<sca.midstX?-1:1;if(edge.flag.x++===0){REDIPS.event.remove(sca.div,'scroll',calculate_cells);autoscrollX(sca.div);}}
else{edge.div.x=0;}
edge.div.y=bound-(sca.midstY>Y?Y-obj_margin[0]-sca.offset[0]:sca.offset[2]-Y-obj_margin[2]);if(edge.div.y>0){if(edge.div.y>bound){edge.div.y=bound;}
edge.div.y*=Y<sca.midstY?-1:1;if(edge.flag.y++===0){REDIPS.event.remove(sca.div,'scroll',calculate_cells);autoscrollY(sca.div);}}
else{edge.div.y=0;}
break;}
else{edge.div.x=edge.div.y=0;}}
evt.cancelBubble=true;if(evt.stopPropagation){evt.stopPropagation();}};cell_changed=function(){if(table<tables.length&&(table!==table_old||row!==row_old||cell!==cell_old)){if(table_old!==null&&row_old!==null&&cell_old!==null){setTdStyle(table_old,row_old,cell_old,bgstyle_old);REDIPS.drag.previous_cell=previous_cell=tables[table_old].rows[row_old].cells[cell_old];REDIPS.drag.current_cell=current_cell=tables[table].rows[row].cells[cell];if(REDIPS.drag.drop_option==='switching'&&mode==='cell'){relocate(current_cell,previous_cell);calculate_cells();set_trc();}
if(mode==='cell'){REDIPS.drag.myhandler_changed(current_cell);}
else if(mode==='row'&&(table!==table_old||row!==row_old)){REDIPS.drag.myhandler_row_changed(current_cell);}}
set_position();}};handler_onresize=function(){if(typeof(window.innerWidth)==='number'){window_width=window.innerWidth;window_height=window.innerHeight;}
else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){window_width=document.documentElement.clientWidth;window_height=document.documentElement.clientHeight;}
else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){window_width=document.body.clientWidth;window_height=document.body.clientHeight;}
scroll_width=document.documentElement.scrollWidth;scroll_height=document.documentElement.scrollHeight;calculate_cells();};set_trc=function(){var previous,cell_current,row_offset,row_found,cells,empty,mark_found,only_found,single_cell,tos=[],X,Y,i;previous=function(){if(table_old!==null&&row_old!==null&&cell_old!==null){table=table_old;row=row_old;cell=cell_old;}};X=pointer.x;Y=pointer.y;for(table=0;table<tables.length;table++){if(tables[table].redips.enabled===false){continue;}
tos[0]=tables[table].redips.offset[0];tos[1]=tables[table].redips.offset[1];tos[2]=tables[table].redips.offset[2];tos[3]=tables[table].redips.offset[3];if(tables[table].sca!==undefined){tos[0]=tos[0]>tables[table].sca.offset[0]?tos[0]:tables[table].sca.offset[0];tos[1]=tos[1]<tables[table].sca.offset[1]?tos[1]:tables[table].sca.offset[1];tos[2]=tos[2]<tables[table].sca.offset[2]?tos[2]:tables[table].sca.offset[2];tos[3]=tos[3]>tables[table].sca.offset[3]?tos[3]:tables[table].sca.offset[3];}
if(tos[3]<X&&X<tos[1]&&tos[0]<Y&&Y<tos[2]){row_offset=tables[table].redips.row_offset;for(row=0;row<row_offset.length-1;row++){if(row_offset[row]===undefined){continue;}
currentCell[0]=row_offset[row][0];if(row_offset[row+1]!==undefined){currentCell[2]=row_offset[row+1][0];}
else{for(i=row+2;i<row_offset.length;i++){if(row_offset[i]!==undefined){currentCell[2]=row_offset[i][0];break;}}}
if(Y<=currentCell[2]){break;}}
row_found=row;if(row===row_offset.length-1){currentCell[0]=row_offset[row][0];currentCell[2]=tables[table].redips.offset[2];}
do{cells=tables[table].rows[row].cells.length-1;for(cell=cells;cell>=0;cell--){currentCell[3]=row_offset[row][3]+tables[table].rows[row].cells[cell].offsetLeft;currentCell[1]=currentCell[3]+tables[table].rows[row].cells[cell].offsetWidth;if(currentCell[3]<=X&&X<=currentCell[1]){break;}}}
while(tables[table].redips.rowspan&&cell===-1&&row-->0);if(row<0||cell<0){previous();}
else if(row!==row_found){currentCell[0]=row_offset[row][0];currentCell[2]=currentCell[0]+tables[table].rows[row].cells[cell].offsetHeight;if(Y<currentCell[0]||Y>currentCell[2]){previous();}}
cell_current=tables[table].rows[row].cells[cell];if(cell_current.childNodes.length>0&&cell_current.getElementsByTagName('table').length>0){currentCell.containTable=true;}
else{currentCell.containTable=false;}
if(cell_current.className.indexOf(REDIPS.drag.trash_cname)===-1){only_found=cell_current.className.indexOf(REDIPS.drag.only.cname)>-1?true:false;if(only_found===true){if(cell_current.className.indexOf(only.div[obj.id])===-1){previous();break;}}
else if(only.div[obj.id]!==undefined&&only.other==='deny'){previous();break;}
else{mark_found=cell_current.className.indexOf(REDIPS.drag.mark.cname)>-1?true:false;if((mark_found===true&&REDIPS.drag.mark.action==='deny')||(mark_found===false&&REDIPS.drag.mark.action==='allow')){if(cell_current.className.indexOf(mark.exception[obj.id])===-1){previous();break;}}}}
single_cell=cell_current.className.indexOf('single')>-1?true:false;if(mode==='cell'){if((REDIPS.drag.drop_option==='single'||single_cell)&&cell_current.childNodes.length>0){if(cell_current.childNodes.length===1&&cell_current.firstChild.nodeType===3){break;}
empty=true;for(i=cell_current.childNodes.length-1;i>=0;i--){if(cell_current.childNodes[i].className&&cell_current.childNodes[i].className.indexOf('drag')>-1){empty=false;break;}}
if(!empty&&table_old!==null&&row_old!==null&&cell_old!==null){if(table_source!==table||row_source!==row||cell_source!==cell){previous();break;}}}
if(cell_current.className.indexOf('rowhandler')>-1){previous();break;}
if(cell_current.parentNode.redips&&cell_current.parentNode.redips.empty_row){previous();break;}}
break;}}};set_position=function(){if(table<tables.length&&table!==null&&row!==null&&cell!==null){bgstyle_old=getTdStyle(table,row,cell);setTdStyle(table,row,cell);table_old=table;row_old=row;cell_old=cell;}};setTdStyle=function(ti,ri,ci,t){var tr,i,s;if(mode==='cell'&&threshold.flag){s=tables[ti].rows[ri].cells[ci].style;s.backgroundColor=(t===undefined)?REDIPS.drag.hover.color_td:t.color[0].toString();if(REDIPS.drag.hover.border_td!==undefined){if(t===undefined){s.border=REDIPS.drag.hover.border_td;}
else{s.borderTopWidth=t.top[0][0];s.borderTopStyle=t.top[0][1];s.borderTopColor=t.top[0][2];s.borderRightWidth=t.right[0][0];s.borderRightStyle=t.right[0][1];s.borderRightColor=t.right[0][2];s.borderBottomWidth=t.bottom[0][0];s.borderBottomStyle=t.bottom[0][1];s.borderBottomColor=t.bottom[0][2];s.borderLeftWidth=t.left[0][0];s.borderLeftStyle=t.left[0][1];s.borderLeftColor=t.left[0][2];}}}
else if(mode==='row'){tr=tables[ti].rows[ri];for(i=0;i<tr.cells.length;i++){s=tr.cells[i].style;s.backgroundColor=(t===undefined)?REDIPS.drag.hover.color_tr:t.color[i].toString();if(REDIPS.drag.hover.border_tr!==undefined){if(t===undefined){if(table===table_source&&row>row_source){s.borderBottom=REDIPS.drag.hover.border_tr;}
else if(table!==table_source||row<row_source){s.borderTop=REDIPS.drag.hover.border_tr;}}
else{s.borderTopWidth=t.top[i][0];s.borderTopStyle=t.top[i][1];s.borderTopColor=t.top[i][2];s.borderBottomWidth=t.bottom[i][0];s.borderBottomStyle=t.bottom[i][1];s.borderBottomColor=t.bottom[i][2];}}}}};getTdStyle=function(ti,ri,ci){var tr,i,c,t={color:[],top:[],right:[],bottom:[],left:[]},border=function(c,name){var width='border'+name+'Width',style='border'+name+'Style',color='border'+name+'Color';return[get_style(c,width),get_style(c,style),get_style(c,color)];};if(mode==='cell'){c=tables[ti].rows[ri].cells[ci];t.color[0]=c.style.backgroundColor;if(REDIPS.drag.hover.border_td!==undefined){t.top[0]=border(c,'Top');t.right[0]=border(c,'Right');t.bottom[0]=border(c,'Bottom');t.left[0]=border(c,'Left');}}
else{tr=tables[ti].rows[ri];for(i=0;i<tr.cells.length;i++){c=tr.cells[i];t.color[i]=c.style.backgroundColor;if(REDIPS.drag.hover.border_tr!==undefined){t.top[i]=border(c,'Top');t.bottom[i]=border(c,'Bottom');}}}
return t;};box_offset=function(box,position,box_scroll){var scrollPosition,oLeft=0,oTop=0,box_old=box;if(position!=='fixed'){scrollPosition=getScrollPosition();oLeft=0-scrollPosition[0];oTop=0-scrollPosition[1];}
if(box_scroll===undefined||box_scroll===true){do{oLeft+=box.offsetLeft-box.scrollLeft;oTop+=box.offsetTop-box.scrollTop;box=box.offsetParent;}
while(box&&box.nodeName!=='BODY');}
else{do{oLeft+=box.offsetLeft;oTop+=box.offsetTop;box=box.offsetParent;}
while(box&&box.nodeName!=='BODY');}
return[oTop,oLeft+box_old.offsetWidth,oTop+box_old.offsetHeight,oLeft];};calculate_cells=function(){var i,j,row_offset,position,cb;for(i=0;i<tables.length;i++){row_offset=[];position=get_style(tables[i],'position');if(position!=='fixed'){position=get_style(tables[i].parentNode,'position');}
for(j=tables[i].rows.length-1;j>=0;j--){if(tables[i].rows[j].style.display!=='none'){row_offset[j]=box_offset(tables[i].rows[j],position);}}
tables[i].redips.offset=box_offset(tables[i],position);tables[i].redips.row_offset=row_offset;}
div_box=box_offset(div_drag);for(i=0;i<scrollable_container.length;i++){position=get_style(scrollable_container[i].div,'position');cb=box_offset(scrollable_container[i].div,position,false);scrollable_container[i].offset=cb;scrollable_container[i].midstX=(cb[1]+cb[3])/2;scrollable_container[i].midstY=(cb[0]+cb[2])/2;}};getScrollPosition=function(){var scrollX,scrollY;if(typeof(window.pageYOffset)==='number'){scrollX=window.pageXOffset;scrollY=window.pageYOffset;}
else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrollX=document.body.scrollLeft;scrollY=document.body.scrollTop;}
else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrollX=document.documentElement.scrollLeft;scrollY=document.documentElement.scrollTop;}
else{scrollX=scrollY=0;}
return[scrollX,scrollY];};autoscrollX=function(so){var pos,old,scrollPosition,maxsp,edgeCrossed,X=pointer.x,Y=pointer.y;if(edge.flag.x>0){calculate_cells();set_trc();if(X<div_box[1]&&X>div_box[3]&&Y<div_box[2]&&Y>div_box[0]){cell_changed();}}
if(typeof(so)==='object'){scroll_object=so;}
if(scroll_object===window){scrollPosition=old=getScrollPosition()[0];maxsp=scroll_width-window_width;edgeCrossed=edge.page.x;}
else{scrollPosition=scroll_object.scrollLeft;maxsp=scroll_object.scrollWidth-scroll_object.clientWidth;edgeCrossed=edge.div.x;}
if(edge.flag.x>0&&((edgeCrossed<0&&scrollPosition>0)||(edgeCrossed>0&&scrollPosition<maxsp))){if(scroll_object===window){window.scrollBy(edgeCrossed,0);scrollPosition=getScrollPosition()[0];pos=parseInt(obj.style.left,10);if(isNaN(pos)){pos=0;}}
else{scroll_object.scrollLeft+=edgeCrossed;}
setTimeout(autoscrollX,REDIPS.drag.speed);}
else{REDIPS.event.add(scroll_object,'scroll',calculate_cells);edge.flag.x=0;currentCell=[0,0,0,0];}};autoscrollY=function(so){var pos,old,scrollPosition,maxsp,edgeCrossed,X=pointer.x,Y=pointer.y;if(edge.flag.y>0){calculate_cells();set_trc();if(X<div_box[1]&&X>div_box[3]&&Y<div_box[2]&&Y>div_box[0]){cell_changed();}}
if(typeof(so)==='object'){scroll_object=so;}
if(scroll_object===window){scrollPosition=old=getScrollPosition()[1];maxsp=scroll_height-window_height;edgeCrossed=edge.page.y;}
else{scrollPosition=scroll_object.scrollTop;maxsp=scroll_object.scrollHeight-scroll_object.clientHeight;edgeCrossed=edge.div.y;}
if(edge.flag.y>0&&((edgeCrossed<0&&scrollPosition>0)||(edgeCrossed>0&&scrollPosition<maxsp))){if(scroll_object===window){window.scrollBy(0,edgeCrossed);scrollPosition=getScrollPosition()[1];pos=parseInt(obj.style.top,10);if(isNaN(pos)){pos=0;}}
else{scroll_object.scrollTop+=edgeCrossed;}
setTimeout(autoscrollY,REDIPS.drag.speed);}
else{REDIPS.event.add(scroll_object,'scroll',calculate_cells);edge.flag.y=0;currentCell=[0,0,0,0];}};clone_div=function(div,drag){var div_cloned=div.cloneNode(true),offset,offset_dragged;if(drag===true){document.getElementById('redips_clone').appendChild(div_cloned);div_cloned.style.zIndex=999;div_cloned.style.position='fixed';offset=box_offset(div);offset_dragged=box_offset(div_cloned);div_cloned.style.top=(offset[0]-offset_dragged[0])+'px';div_cloned.style.left=(offset[3]-offset_dragged[3])+'px';}
if(div_cloned.setCapture){div_cloned.setCapture();}
div_cloned.className=div_cloned.className.replace('clone','');if(cloned_id[div.id]===undefined){cloned_id[div.id]=0;}
div_cloned.id=div.id+'c'+cloned_id[div.id];cloned_id[div.id]+=1;copy_properties(div,div_cloned);return(div_cloned);};copy_properties=function(src,cln){var copy=[],childs;copy[0]=function(e1,e2){if(e1.redips){e2.redips={};e2.redips.enabled=e1.redips.enabled;e2.redips.container=e1.redips.container;if(e1.redips.enabled){e2.onmousedown=handler_onmousedown;e2.ontouchstart=handler_onmousedown;e2.ondblclick=handler_ondblclick;}}};copy[1]=function(e1,e2){if(e1.redips){e2.redips={};e2.redips.empty_row=e1.redips.empty_row;}};childs=function(e){var el1,el2,i,tn=['DIV','TR'];el1=src.getElementsByTagName(tn[e]);el2=cln.getElementsByTagName(tn[e]);for(i=0;i<el2.length;i++){copy[e](el1[i],el2[i]);}};if(src.nodeName==='DIV'){copy[0](src,cln);}
else if(src.nodeName==='TR'){copy[1](src,cln);}
childs(0);childs(1);};clone_limit=function(){var match_arr,limit_type,limit,classes;classes=obj_old.className;match_arr=classes.match(/climit(\d)_(\d+)/);if(match_arr!==null){limit_type=parseInt(match_arr[1],10);limit=parseInt(match_arr[2],10);limit-=1;classes=classes.replace(/climit\d_\d+/g,'');if(limit<=0){classes=classes.replace('clone','');if(limit_type===2){classes=classes.replace('drag','');obj_old.onmousedown=null;obj_old.ontouchstart=null;obj_old.style.cursor='auto';REDIPS.drag.myhandler_clonedend2();}
else{REDIPS.drag.myhandler_clonedend1();}}
else{classes=classes+' climit'+limit_type+'_'+limit;}
obj_old.className=normalize(classes);}};elementControl=function(evt){var flag=false,srcName,classes,regex_nodrag=/\bnodrag\b/i;if(evt.srcElement){srcName=evt.srcElement.nodeName;classes=evt.srcElement.className;}
else{srcName=evt.target.nodeName;classes=evt.target.className;}
switch(srcName){case'A':case'INPUT':case'SELECT':case'OPTION':case'TEXTAREA':flag=true;break;default:if(regex_nodrag.test(classes)){flag=true;}
else{flag=false;}}
return flag;};enable_drag=function(enable_flag,el,type){var i,j,k,divs=[],tbls=[],borderStyle,opacity,cursor,overflow,autoscroll,enabled,cb,handler1,handler2,position,regex_drag=/\bdrag\b/i,regex_noautoscroll=/\bnoautoscroll\b/i;opacity=REDIPS.drag.opacity_disabled;if(enable_flag===true||enable_flag==='init'){handler1=handler_onmousedown;handler2=handler_ondblclick;borderStyle=REDIPS.drag.border;cursor='move';enabled=true;}
else{handler1=handler2=null;borderStyle=REDIPS.drag.border_disabled;cursor='auto';enabled=false;}
if(el===undefined){divs=div_drag.getElementsByTagName('div');}
else if(type==='subtree'){if(typeof(el)==='string'){divs=document.getElementById(el).getElementsByTagName('div');}
else{divs=el.getElementsByTagName('div');}}
else if(typeof(el)==='string'){divs[0]=document.getElementById(el);}
else{divs[0]=el;}
for(i=0,j=0;i<divs.length;i++){if(regex_drag.test(divs[i].className)){if(enable_flag==='init'){divs[i].redips={};divs[i].redips.container=div_drag;}
else if(enable_flag===true&&typeof(opacity)==='number'){divs[i].style.opacity='';divs[i].style.filter='';}
else if(enable_flag===false&&typeof(opacity)==='number'){divs[i].style.opacity=opacity/100;divs[i].style.filter='alpha(opacity='+opacity+')';}
divs[i].onmousedown=handler1;divs[i].ontouchstart=handler1;divs[i].ondblclick=handler2;divs[i].style.borderStyle=borderStyle;divs[i].style.cursor=cursor;divs[i].redips.enabled=enabled;}
else if(enable_flag==='init'){overflow=get_style(divs[i],'overflow');if(overflow!=='visible'){REDIPS.event.add(divs[i],'scroll',calculate_cells);position=get_style(divs[i],'position');cb=box_offset(divs[i],position,false);if(regex_noautoscroll.test(divs[i].className)){autoscroll=false;}
else{autoscroll=true;}
scrollable_container[j]={div:divs[i],offset:cb,midstX:(cb[1]+cb[3])/2,midstY:(cb[0]+cb[2])/2,autoscroll:autoscroll};tbls=divs[i].getElementsByTagName('table');for(k=0;k<tbls.length;k++){tbls[k].sca=scrollable_container[j];}
j++;}}}};delete_object=function(el){var div,i;if(typeof(el)==='object'&&el.nodeName==='DIV'){el.parentNode.removeChild(el);}
else if(typeof(el)==='string'){div=document.getElementById(el);if(div){div.parentNode.removeChild(div);}}};enable_table=function(enable_flag,el){var i;if(typeof(el)==='object'&&el.nodeName==='TABLE'){el.redips.enabled=enable_flag;}
else{for(i=0;i<tables.length;i++){if(tables[i].className.indexOf(el)>-1){tables[i].redips.enabled=enable_flag;}}}};get_style=function(el,style_name){var val;if(el&&el.currentStyle){val=el.currentStyle[style_name];}
else if(el&&window.getComputedStyle){val=document.defaultView.getComputedStyle(el,null)[style_name];}
return val;};find_parent=function(tag_name,el){while(el&&el.nodeName!==tag_name){el=el.parentNode;}
return el;};find_cell=function(param,el){var tbl=find_parent('TABLE',el),ri,ci,c;switch(param){case'firstInColumn':ri=0;ci=el.cellIndex;break;case'firstInRow':ri=el.parentNode.rowIndex;ci=0;break;case'lastInColumn':ri=tbl.rows.length-1;ci=el.cellIndex;break;case'lastInRow':ri=el.parentNode.rowIndex;ci=tbl.rows[0].cells.length-1;break;case'last':ri=tbl.rows.length-1;ci=tbl.rows[0].cells.length-1;break;default:ri=ci=0;}
c=tbl.rows[ri].cells[ci];return[ri,ci,c];};save_content=function(tbl){var query='',tbl_start,tbl_end,tbl_rows,cells,tbl_cell,t,r,c,d;tables.sort(function(a,b){return a.redips.idx-b.redips.idx;});if(tbl===undefined){tbl_start=0;tbl_end=tables.length-1;}
else if(tbl<0||tbl>tables.length-1){tbl_start=tbl_end=0;}
else{tbl_start=tbl_end=tbl;}
for(t=tbl_start;t<=tbl_end;t++){tbl_rows=tables[t].rows.length;for(r=0;r<tbl_rows;r++){cells=tables[t].rows[r].cells.length;for(c=0;c<cells;c++){tbl_cell=tables[t].rows[r].cells[c];if(tbl_cell.childNodes.length>0){for(d=0;d<tbl_cell.childNodes.length;d++){if(tbl_cell.childNodes[d].nodeName==='DIV'){query+='p[]='+tbl_cell.childNodes[d].id+'_'+t+'_'+r+'_'+c+'&';}}}}}}
query=query.substring(0,query.length-1);tables.sort(function(a,b){return b.redips.sort-a.redips.sort;});return query;};relocate=function(from,to,mode){var i,j,tbl2,cn,move;move=function(el,to){var target=REDIPS.drag.get_position(to);REDIPS.drag.move_object({obj:el,target:target,callback:function(div){var tbl;an_counter--;if(an_counter===0){tbl=REDIPS.drag.find_parent('TABLE',div);REDIPS.drag.enable_table(true,tbl);}}});};if(from===to){return;}
cn=from.childNodes.length;if(mode==='animation'){if(cn>0){tbl2=find_parent('TABLE',to);REDIPS.drag.enable_table(false,tbl2);}
for(i=0;i<cn;i++){if(from.childNodes[i].nodeType===1&&from.childNodes[i].nodeName==='DIV'&&REDIPS.drag.obj!==from.childNodes[i]){an_counter++;move(from.childNodes[i],to);}}}
else{for(i=0,j=0;i<cn;i++){if(from.childNodes[j].nodeType===1&&from.childNodes[j].nodeName==='DIV'&&REDIPS.drag.obj!==from.childNodes[j]){to.appendChild(from.childNodes[j]);}
else{j++;}}}};empty_cell=function(td){var i,cn;if(td.nodeName!=='TD'){return false;}
cn=td.childNodes.length;for(i=0;i<cn;i++){td.removeChild(td.childNodes[0]);}};shift_cells=function(td1,td2){var tbl1,tbl2,pos,pos1,pos2,d,c1,c2,soption,rows,cols,x,y,max;if(td1===td2){return;}
soption=REDIPS.drag.shift_option;pos1=[td1.parentNode.rowIndex,td1.cellIndex];pos2=[td2.parentNode.rowIndex,td2.cellIndex];tbl1=find_parent('TABLE',td1);tbl2=find_parent('TABLE',td2);rows=tbl2.rows.length-1;cols=tbl2.rows[0].cells.length-1;switch(soption){case'vertical2':pos=(tbl1===tbl2&&td1.cellIndex===td2.cellIndex)?pos1:find_cell('lastInColumn',td2);break;case'horizontal2':pos=(tbl1===tbl2&&td1.parentNode.rowIndex===td2.parentNode.rowIndex)?pos1:find_cell('lastInRow',td2);break;default:pos=(tbl1===tbl2)?pos1:[rows,cols];}
if(soption==='vertical1'||soption==='vertical2'){d=(pos[1]*1000+pos[0]<pos2[1]*1000+pos2[0])?1:-1;max=rows;x=0;y=1;}
else{d=(pos[0]*1000+pos[1]<pos2[0]*1000+pos2[1])?1:-1;max=cols;x=1;y=0;}
while(pos[0]!==pos2[0]||pos[1]!==pos2[1]){c2=tbl2.rows[pos[0]].cells[pos[1]];pos[x]+=d;if(pos[x]<0){pos[x]=max;pos[y]--;}
else if(pos[x]>max){pos[x]=0;pos[y]++;}
c1=tbl2.rows[pos[0]].cells[pos[1]];if(REDIPS.drag.animation_shift){relocate(c1,c2,'animation');}
else{relocate(c1,c2);}}};move_object=function(ip){var p={'direction':1},x1,y1,w1,h1,x2,y2,w2,h2,row,col,dx,dy,pos,i,target;p.callback=ip.callback;if(typeof(ip.id)==='string'){p.obj=p.obj_old=document.getElementById(ip.id);}
else if(typeof(ip.obj)==='object'&&ip.obj.nodeName==='DIV'){p.obj=p.obj_old=ip.obj;}
if(ip.mode==='row'){p.mode='row';i=get_table_index(ip.source[0]);row=ip.source[1];obj_old=p.obj_old=tables[i].rows[row];p.obj=row_clone(p.obj_old);}
else if(p.obj.className.indexOf('row')>-1){p.mode='row';p.obj=p.obj_old=obj_old=find_parent('TR',p.obj);p.obj=row_clone(p.obj_old);}
else{p.mode='cell';}
p.obj.style.zIndex=999;if(div_drag!==p.obj.redips.container){div_drag=p.obj.redips.container;init_tables();}
pos=box_offset(p.obj);w1=pos[1]-pos[3];h1=pos[2]-pos[0];x1=pos[3];y1=pos[0];if(ip.target===undefined){ip.target=get_position();}
p.target=ip.target;i=get_table_index(ip.target[0]);row=ip.target[1];col=ip.target[2];p.target_cell=tables[i].rows[row].cells[col];if(p.mode==='cell'){pos=box_offset(p.target_cell);w2=pos[1]-pos[3];h2=pos[2]-pos[0];x2=pos[3]+(w2-w1)/2;y2=pos[0]+(h2-h1)/2;}
else{pos=box_offset(tables[i].rows[row]);w2=pos[1]-pos[3];h2=pos[2]-pos[0];x2=pos[3];y2=pos[0];}
dx=x2-x1;dy=y2-y1;p.obj.style.position='fixed';if(Math.abs(dx)>Math.abs(dy)){p.type='horizontal';p.m=dy/dx;p.b=y1-p.m*x1;p.k1=(x1+x2)/(x1-x2);p.k2=2/(x1-x2);if(x1>x2){p.direction=-1;}
i=x1;p.last=x2;}
else{p.type='vertical';p.m=dx/dy;p.b=x1-p.m*y1;p.k1=(y1+y2)/(y1-y2);p.k2=2/(y1-y2);if(y1>y2){p.direction=-1;}
i=y1;p.last=y2;}
p.obj.redips.animated=true;animation(i,p);return[p.obj,p.obj_old];};animation=function(i,p){var k=(p.k1-p.k2*i)*(p.k1-p.k2*i),f;i=i+REDIPS.drag.animation_step*(4-k*3)*p.direction;f=p.m*i+p.b;if(p.type==='horizontal'){p.obj.style.left=i+'px';p.obj.style.top=f+'px';}
else{p.obj.style.left=f+'px';p.obj.style.top=i+'px';}
if((i<p.last&&p.direction>0)||((i>p.last)&&p.direction<0)){setTimeout(function(){animation(i,p);},REDIPS.drag.animation_pause*k);}
else{p.obj.style.zIndex=-1;p.obj.style.position='static';p.obj.redips.animated=false;if(p.mode==='cell'){p.target_cell.appendChild(p.obj);}
else{row_drop(get_table_index(p.target[0]),p.target[1],p.obj);}
if(typeof(p.callback)==='function'){p.callback(p.obj);}}};get_position=function(ip){var toi,toi_source,ci,ri,ti,el,tbl,arr=[];if(ip===undefined){if(table<tables.length){toi=tables[table].redips.idx;}
else if(table_old===null||row_old===null||cell_old===null){toi=tables[table_source].redips.idx;}
else{toi=tables[table_old].redips.idx;}
toi_source=tables[table_source].redips.idx;arr=[toi,row,cell,toi_source,row_source,cell_source];}
else{if(typeof(ip)==='string'){el=document.getElementById(ip);}
else{el=ip;}
el=find_parent('TD',el);if(el&&el.nodeName==='TD'){ci=el.cellIndex;ri=el.parentNode.rowIndex;tbl=find_parent('TABLE',el.parentNode);ti=tbl.redips.idx;arr=[ti,ri,ci];}}
return arr;};get_table_index=function(idx){var i;for(i=0;i<tables.length;i++){if(tables[i].redips.idx===idx){break;}}
return i;};normalize=function(str){return str.replace(/^\s+|\s+$/g,'').replace(/\s{2,}/g,' ');};has_childs=function(el){var i;for(i=0;i<el.childNodes.length;i++){if(el.childNodes[i].nodeType===1){return true;}}
return false;};row_opacity=function(el,opacity,color){var td,i,j;if(typeof(el)==='string'){el=document.getElementById(el);el=find_parent('TABLE',el);}
if(el.nodeName==='TR'){td=el.getElementsByTagName('td');for(i=0;i<td.length;i++){td[i].style.backgroundColor=color?color:'';if(opacity==='empty'){td[i].innerHTML='';}
else{for(j=0;j<td[i].childNodes.length;j++){if(td[i].childNodes[j].nodeType===1){td[i].childNodes[j].style.opacity=opacity/100;td[i].childNodes[j].style.filter='alpha(opacity='+opacity+')';}}}}}
else{el.style.opacity=opacity/100;el.style.filter='alpha(opacity='+opacity+')';}};row_empty=function(tbl_id,row_idx,color){var tbl=document.getElementById(tbl_id),row=tbl.rows[row_idx];if(color===undefined){color=REDIPS.drag.row_empty_color;}
if(row.redips===undefined){row.redips={};}
row.redips.empty_row=true;row_opacity(row,'empty',color);};return{obj:obj,obj_old:obj_old,mode:mode,source_cell:source_cell,previous_cell:previous_cell,current_cell:current_cell,target_cell:target_cell,hover:hover,bound:bound,speed:speed,only:only,mark:mark,border:border,border_disabled:border_disabled,opacity_disabled:opacity_disabled,trash_cname:trash_cname,trash_ask:trash_ask,trash_ask_row:trash_ask_row,drop_option:drop_option,shift_option:shift_option,multiple_drop:multiple_drop,delete_cloned:delete_cloned,delete_shifted:delete_shifted,clone_shiftKey:clone_shiftKey,clone_shiftKey_row:clone_shiftKey_row,animation_pause:animation_pause,animation_step:animation_step,animation_shift:animation_shift,shift_after:shift_after,row_empty_color:row_empty_color,init:init,enable_drag:enable_drag,enable_table:enable_table,clone_div:clone_div,save_content:save_content,relocate:relocate,empty_cell:empty_cell,move_object:move_object,delete_object:delete_object,get_position:get_position,row_opacity:row_opacity,row_empty:row_empty,getScrollPosition:getScrollPosition,get_style:get_style,find_parent:find_parent,myhandler_clicked:function(){},myhandler_dblclicked:function(){},myhandler_moved:function(){},myhandler_notmoved:function(){},myhandler_dropped:function(){},myhandler_dropped_before:function(){},myhandler_switched:function(){},myhandler_changed:function(){},myhandler_cloned:function(){},myhandler_cloned_dropped:function(){},myhandler_clonedend1:function(){},myhandler_clonedend2:function(){},myhandler_notcloned:function(){},myhandler_deleted:function(){},myhandler_undeleted:function(){},myhandler_row_clicked:function(){},myhandler_row_moved:function(){},myhandler_row_notmoved:function(){},myhandler_row_dropped:function(){},myhandler_row_dropped_before:function(){},myhandler_row_dropped_source:function(){},myhandler_row_changed:function(){},myhandler_row_cloned:function(){},myhandler_row_notcloned:function(){},myhandler_row_deleted:function(){},myhandler_row_undeleted:function(){}};}());if(!REDIPS.event){REDIPS.event=(function(){var add,remove;add=function(obj,eventName,handler){if(obj.addEventListener){obj.addEventListener(eventName,handler,false);}
else if(obj.attachEvent){obj.attachEvent('on'+eventName,handler);}
else{obj['on'+eventName]=handler;}};remove=function(obj,eventName,handler){if(obj.removeEventListener){obj.removeEventListener(eventName,handler,false);}
else if(obj.detachEvent){obj.detachEvent('on'+eventName,handler);}
else{obj['on'+eventName]=null;}};return{add:add,remove:remove};}());}