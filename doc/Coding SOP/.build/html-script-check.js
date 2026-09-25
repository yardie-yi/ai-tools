
// 所有交互仅用于页面内教学演示，不访问网络、不执行工程命令。
document.querySelectorAll('[data-route-button]').forEach(button=>{
  button.addEventListener('click',()=>{
    const route=button.dataset.routeButton;
    document.querySelectorAll('[data-route-button]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    document.querySelectorAll('[data-route]').forEach(panel=>panel.hidden=panel.dataset.route!==route);
  });
});
document.querySelectorAll('[data-copy]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const text=document.getElementById(button.dataset.copy).textContent;
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}
      else{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();const copied=document.execCommand('copy');area.remove();if(!copied)throw new Error('copy unavailable')}
      button.textContent='已复制';document.getElementById('copy-status').textContent='已复制到剪贴板';
      window.setTimeout(()=>button.textContent='复制',1600);
    }catch(error){button.textContent='请选中复制';document.getElementById('copy-status').textContent='浏览器未允许自动复制，请选中代码手动复制。'}
  });
});
const ticketDefinitions=[
  {id:'T1',name:'接收基线',deps:[],description:'固定正常接收行为与队列接口，为后续切片提供稳定输入。'},
  {id:'T2',name:'满队列策略',deps:['T1'],description:'交付丢新项、计数与恢复测试，覆盖 A1 / A2。'},
  {id:'T3',name:'占用观测',deps:['T1'],description:'交付安全诊断快照及相应测试，可与 T2 并行。'},
  {id:'T4',name:'集成压力验证',deps:['T2','T3'],description:'同时消费策略与观测产物，形成目标板验证记录。'}
];
let ticketStates=Object.fromEntries(ticketDefinitions.map(ticket=>[ticket.id,'todo']));
const stateNames={blocked:'等待依赖',ready:'可执行',running:'执行中',review:'待审查',done:'已完成'};
const buttonNames={blocked:'依赖未完成',ready:'开始执行',running:'提交验证与审查',review:'审查通过并接收',done:'交付已接收'};
function currentState(ticket){return ticketStates[ticket.id]==='todo'?(ticket.deps.every(id=>ticketStates[id]==='done')?'ready':'blocked'):ticketStates[ticket.id]}
function renderTickets(){
  const board=document.getElementById('tickets-board');board.replaceChildren();
  ticketDefinitions.forEach(ticket=>{
    const state=currentState(ticket);const card=document.createElement('article');card.className='ticket';
    const top=document.createElement('div');top.className='ticket-top';
    const title=document.createElement('b');title.textContent=ticket.id+' · '+ticket.name;
    const status=document.createElement('span');status.className='status '+state;status.textContent=stateNames[state];top.append(title,status);
    const description=document.createElement('p');description.textContent=ticket.description;
    const dependency=document.createElement('p');dependency.textContent='依赖：'+(ticket.deps.join('、')||'无');
    const button=document.createElement('button');button.type='button';button.className='button';button.textContent=buttonNames[state];button.disabled=state==='blocked'||state==='done';button.setAttribute('aria-label',ticket.id+' '+buttonNames[state]);
    button.addEventListener('click',()=>{
      ticketStates[ticket.id]=state==='ready'?'running':state==='running'?'review':'done';
      const next=ticketStates[ticket.id];renderTickets();
      let message=ticket.id+' 已进入“'+stateNames[next]+'”。';
      if(next==='review')message+='演示假设已提交验证证据；真实任务需先核查结果与阻塞意见。';
      if(next==='done')message+='依赖此任务的切片只有在全部上游完成后才会解锁。';
      if(ticketDefinitions.every(item=>ticketStates[item.id]==='done'))message='全部 Ticket 已接收。下一步仍需 PR 级整体 Review 与人工 CR；本演示未运行任何真实验证。';
      document.getElementById('sim-log').textContent=message;
    });
    card.append(top,description,dependency,button);board.appendChild(card);
  });
}
document.getElementById('reset-tickets').addEventListener('click',()=>{ticketStates=Object.fromEntries(ticketDefinitions.map(ticket=>[ticket.id,'todo']));renderTickets();document.getElementById('sim-log').textContent='已重置。先完成 T1，T2 与 T3 才可并行。'});
renderTickets();
function updateCapacity(){
  const agents=Number(document.getElementById('agent-count').value);const capacity=Number(document.getElementById('review-count').value);const backlog=Math.max(0,agents-capacity);
  document.getElementById('agent-output').value=agents;document.getElementById('review-output').value=capacity;document.getElementById('backlog').textContent=backlog;
  document.getElementById('backlog-meter').style.width=(backlog/7*100)+'%';
  document.getElementById('backlog-meter').style.background=backlog>0?'#b47f32':'#087c83';
  document.getElementById('capacity-advice').textContent=backlog>0?'生产速度超过审查速度。先减少并发、缩小切片或提高证据质量，再增加新任务。':'在这个简化假设下，没有新增审查积压。仍需检查任务依赖、返工与共享资源是否限制并行。';
}
document.getElementById('agent-count').addEventListener('input',updateCapacity);document.getElementById('review-count').addEventListener('input',updateCapacity);updateCapacity();
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.nav a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id))}})},{rootMargin:'-8% 0px -72% 0px',threshold:0});
  document.querySelectorAll('main section').forEach(section=>observer.observe(section));
}
// 打印时展开说明，确保屏幕折叠状态不会使纸面丢失内容。
let openDetails=[];
window.addEventListener('beforeprint',()=>{openDetails=[...document.querySelectorAll('details')].filter(detail=>!detail.open);openDetails.forEach(detail=>detail.open=true)});
window.addEventListener('afterprint',()=>{openDetails.forEach(detail=>detail.open=false);openDetails=[]});
