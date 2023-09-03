const botjwt = document.getElementById('botjwt');
const botsay = document.getElementById('botsay');
const odaisim = document.getElementById('odaisim');

const status = document.getElementById('status');

let ws = [];

let hazir = 0;

const emailsifre = localStorage.getItem('wov-emailsifre');

if(emailsifre){
	const parsed = JSON.parse(emailsifre);
	hesabagiris(parsed.em, parsed.pw);
	document.getElementById('hesapcikis').style.display = 'inline-block';
} else {
	const email = prompt('email: ');
	const password = prompt('sifre: ');

	localStorage.setItem('wov-emailsifre', JSON.stringify({em: email, pw: password}));

	location.reload();
}

function lstemizle(){
	localStorage.removeItem('wov-emailsifre');
	location.reload();
}

function hesabagiris(em, pw){
	status.innerHTML = 'jwt aliniyor. ' + em;
	fetch('https://api-auth.wolvesville.com/players/signInWithEmailAndPassword', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			
			},
			body: JSON.stringify({
				email: em,
				password: pw
			})
		}).then(res => res.json()).then(data => {
			if(data.idToken){
				botjwt.value = data.idToken;
				status.innerHTML = 'jwt alindi.';
			} else document.getElementById('a').innerHTML = 'Hata?';
		})
}

function wsekle(){
	for(let j = 0; j < botsay.value; j++){
		ws[j] = new WebSocket(`wss://api-game.wolvesville.com/socket.io/?firebaseToken=${botjwt.value}&gameId=undefined&gameMode=custom&password=undefined&ids=1&EIO=4&transport=websocket`);
		ws[j].onopen = () => {
			hazir++;
			status.innerHTML = hazir + ' bot hazir.';
		}
		ws[j].onmessage = (m) => {
			if(m.data == '2'){
				ws[j].send('3');
			}
		}
	}
}

function baslat(){
	status.innerHTML = 'bekleniyor..';

	for(let i = 0; i < botsay.value; i++){
		ws[i].send('40');

		ws[i].onmessage = (m) => {
			const d = JSON.parse(m.data.slice(2));

			if(d[0] == 'game-joined'){
				// ws[i].send(`42["host-custom-game-change-settings","{\\\\"name\\\\":\\\\".${'\\\\\\\\n'.repeat(10)}\\\\",\\\\"language\\\\":\\\\"tr\\\\",\\\\"gameServerBaseUrl\\\\":\\\\"https://api-game.wolvesville.com\\\\",\\\\"startGameDelayInMs\\\\":0,\\\\"nightDurationInMs\\\\":0,\\\\"dayDiscussionDurationInMs\\\\":0,\\\\"dayVotingDurationInMs\\\\":0,\\\\"roles\\\\":[${new Array(8).fill(`\\\\"villager\\\\"`).toString()}],\\\\"randomRolesExcludedRoles\\\\":[],\\\\"friendsGameEveryoneCanInvite\\\\":false,\\\\"privateGame\\\\":false,\\\\"talismansEnabled\\\\":true,\\\\"hideRoleOnDeath\\\\":false,\\\\"hostedDate\\\\":\\\\"\\\\",\\\\"hasPassword\\\\":false,\\\\"password\\\\":MGBDPW\\\\"\\\\",\\\\"minLevel\\\\":1,\\\\"voiceEnabled\\\\":true,\\\\"regularXp\\\\":false,\\\\"discussionSkipEnabled\\\\":false,\\\\"votesHidden\\\\":false,\\\\"preventAutostartIfLobbyIsFull\\\\":false,\\\\"disableSpecSeeingDeathChat\\\\":false,\\\\"disabledRoleCardAbilities\\\\":[],\\\\"isRowWars\\\\":false,\\\\"allCoupled\\\\":false,\\\\"unleashedElements\\\\":false,\\\\"mandatoryVote\\\\":false,\\\\"assassinsConvention\\\\":false,\\\\"clearChatDaily\\\\":false,\\\\"hotPotatoEnabled\\\\":false,\\\\"is9PlayerGame\\\\":false,\\\\"is25PlayerGame\\\\":false,\\\\"honorEnabled\\\\":false}"]`);
				ws[i].send(`42["host-custom-game-change-settings","{\\"name\\":\\"${odaisim.value}\\",\\"language\\":\\"tr\\",\\"gameServerBaseUrl\\":\\"https://api-game.wolvesville.com\\",\\"startGameDelayInMs\\":15000,\\"nightDurationInMs\\":30000,\\"dayDiscussionDurationInMs\\":60000,\\"dayVotingDurationInMs\\":30000,\\"roles\\":[\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\",\\"villager\\"],\\"randomRolesExcludedRoles\\":[],\\"friendsGameEveryoneCanInvite\\":false,\\"privateGame\\":false,\\"talismansEnabled\\":true,\\"hideRoleOnDeath\\":false,\\"hostedDate\\":\\"2023-09-01T09:29:20.349Z\\",\\"hasPassword\\":false,\\"password\\":\\"MGBDPW\\",\\"minLevel\\":0,\\"voiceEnabled\\":true,\\"regularXp\\":false,\\"discussionSkipEnabled\\":false,\\"votesHidden\\":false,\\"preventAutostartIfLobbyIsFull\\":false,\\"disableSpecSeeingDeathChat\\":false,\\"disabledRoleCardAbilities\\":[],\\"isRowWars\\":false,\\"allCoupled\\":false,\\"unleashedElements\\":false,\\"mandatoryVote\\":false,\\"assassinsConvention\\":false,\\"clearChatDaily\\":false,\\"hotPotatoEnabled\\":false,\\"is9PlayerGame\\":false,\\"is25PlayerGame\\":false,\\"honorEnabled\\":false}"]`);
				setInterval(() => {
					ws[i].send(`42["player-heartbeat"]`);
					ws[i].send(`3`);
				}, 15000);
			}
			status.innerHTML = 'Odalar olusturuldu.'
		}
	}
}
