// Nội dung chữ (tiếng Anh) cho mở màn và cảnh kết thúc.
// Token: {M} = tên thú cưỡi, {B} = tên boss, {W} = bên thắng, {L} = bên thua.
// Mỗi câu hỏi có câu trả lời tương ứng cho từng kết quả: a (chung), win (thú cưỡi thắng), lose (boss thắng).

export const STYLES = ['clash', 'inferno', 'cyber', 'arena', 'storm', 'frost', 'toxic', 'royal', 'void', 'sunset']
export const COUNTDOWNS = ['ring', 'shock', 'tile', 'slice', 'stopwatch', 'radar', 'digital', 'hex']
export const OUTRO_KINDS = ['trophy', 'ko', 'crown', 'fireworks', 'suspense', 'stamp']
export const STATS_KINDS = ['cards', 'ticker', 'gauges', 'billboard']
export const CTA_KINDS = ['button', 'neon', 'banner', 'icons']

export const QUESTIONS = [
  { q: 'WHO WILL WIN?', a: '{W} WINS!' },
  { q: 'WHO WILL SURVIVE?', a: '{W} SURVIVES!' },
  { q: 'WHO RULES THE ARENA?', a: '{W} RULES THE ARENA!' },
  { q: 'CAN {M} BEAT {B}?', win: 'YES! {M} CRUSHED {B}!', lose: 'NO! {B} WAS TOO STRONG!' },
  { q: 'HEROES OR MONSTERS?', win: 'THE HEROES TRIUMPH!', lose: 'THE MONSTERS TAKE OVER!' },
  { q: 'WHO IS STRONGER?', a: '{W} IS STRONGER!' },
  { q: 'WHO FALLS FIRST?', a: '{L} FALLS FIRST!' },
  { q: 'ONLY ONE WALKS AWAY...', a: '{W} WALKS AWAY!' },
  { q: 'WHO WILL TAKE THE VICTORY?', a: '{W} TAKES THE VICTORY!' },
  { q: 'BEAST OR BOSS: PICK YOUR SIDE!', win: 'THE BEAST WINS!', lose: 'THE BOSS WINS!' },
  { q: 'CAN THE BOSS BE STOPPED?', win: 'YES! {B} WAS STOPPED!', lose: 'NO! {B} IS UNSTOPPABLE!' },
  { q: 'WHO WILL BE LEFT STANDING?', a: '{W} IS LEFT STANDING!' },
  { q: 'IS {M} STRONG ENOUGH?', win: '{M} WAS STRONG ENOUGH!', lose: '{M} WAS NOT STRONG ENOUGH!' },
  { q: 'WILL {B} BE DEFEATED?', win: '{B} WAS DEFEATED!', lose: '{B} SURVIVED!' },
  { q: 'WHO WILL BREAK FIRST?', a: '{L} BREAKS FIRST!' },
  { q: 'WHICH SIDE WILL CONQUER?', a: '{W} CONQUERS!' },
  { q: 'TEAM {M} OR TEAM {B}?', a: 'TEAM {W} TAKES IT!' },
  { q: 'WHO WILL CLAIM THE THRONE?', a: '{W} CLAIMS THE THRONE!' },
  { q: 'POWER OR CHAOS?', win: 'POWER WINS!', lose: 'CHAOS WINS!' },
  { q: 'CAN {M} DO IT?', win: '{M} DID IT!', lose: '{M} FELL SHORT!' },
  { q: 'WHO IS THE REAL CHAMPION?', a: '{W} IS THE CHAMPION!' },
  { q: 'CAN ANYONE STOP {B}?', win: '{M} STOPPED {B}!', lose: 'NOBODY CAN STOP {B}!' },
  { q: 'WHO WILL DOMINATE?', a: '{W} DOMINATES!' },
  { q: 'WHO HAS WHAT IT TAKES?', a: '{W} HAS WHAT IT TAKES!' },
  { q: 'WHO WILL RISE ABOVE?', a: '{W} RISES ABOVE!' },
  { q: 'THE ULTIMATE SHOWDOWN: WHO WINS?', a: '{W} WINS THE SHOWDOWN!' },
  { q: 'WHO LANDS THE KNOCKOUT?', a: '{W} LANDS THE KNOCKOUT!' },
  { q: 'GUESS THE WINNER!', a: 'THE WINNER IS {W}!' },
  { q: 'WHO WILL BE CROWNED?', a: '{W} IS CROWNED!' },
  { q: 'IS THIS THE END FOR {M}?', win: 'NOT YET! {M} SURVIVES!', lose: 'YES... {M} FALLS!' },
  { q: 'WHO WILL OWN THE BATTLEFIELD?', a: '{W} OWNS THE BATTLEFIELD!' },
]

export const DRAW_ANSWERS = ['TIME IS UP... IT IS A DRAW!', 'NO WINNER THIS TIME!', 'IT ENDS IN A DRAW!']

export const SUBTITLES = [
  'COMMENT YOUR PICK BELOW',
  'TEAM LEFT OR TEAM RIGHT?',
  'MAKE YOUR PREDICTION NOW',
  'WATCH TO THE END TO FIND OUT',
  'WRITE YOUR GUESS IN THE COMMENTS',
  'ONLY ONE SIDE CAN WIN',
  'DO YOU TRUST THE BEAST OR THE BOSS?',
  'LOCK IN YOUR ANSWER!',
]
export const READY = ['READY?', 'GET READY!', 'ARE YOU READY?', 'BRACE YOURSELF!', 'FIGHT STARTS NOW!', 'HERE WE GO!', 'LOCK AND LOAD!']
export const GO = ['FIGHT!', 'GO!', 'BEGIN!', 'BATTLE START!', 'LET US GO!', 'CLASH!']

export function fill(tpl, tokens) {
  return tpl.replace(/\{(M|B|W|L)\}/g, (_, k) => tokens[k])
}
