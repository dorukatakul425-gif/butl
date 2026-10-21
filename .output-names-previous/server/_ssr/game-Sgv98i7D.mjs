import { i as __toESM } from "../_runtime.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { n as roulettePrizeNames } from "./roulette-config-D0UHMX9J.mjs";
import { t as getSupabase } from "./supabase-BUCaDQ6-.mjs";
import { d as require_react, s as require_react_dom, u as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { i as useAuth, n as refreshProfile, t as getAuth } from "./auth-09P8qAxJ.mjs";
import { C as Play, h as Square, ot as ArrowLeft, t as X, w as Pause } from "../_libs/lucide-react.mjs";
import { n as gameError } from "./game-language-BY9iR37b.mjs";
import { _ as useGameLoading, a as completeLoadingStage, g as translate, l as dialogImage, m as loadCilizAssets, n as LEVEL_FRAMES, p as isLevelFrameOpen, u as failGameLoading } from "./ciliz-assets-Bqoyx58m.mjs";
import { a as buildGiftItems, c as joinedIds, i as TIERS, o as createSentGift, r as RAND_MOD, s as entryParticipantCurrent, u as tier } from "./entry-fx-lifetime-V0m3CLF_.mjs";
import { a as fetchPassInfo, d as passShortLeft, m as ui_btn_gold_add_heart_up_default, o as getCachedPass, p as subscribePass, s as hasClaimable } from "./season-pass-B7Jrau3J.mjs";
import { a as playSfx, c as preloadSfx, f as setSfxVolume, h as DEFAULT_PHOTO, i as playChatAlert, l as prepareSfx, m as useSfxVolume, n as loadProfileBio, o as playerPhoto, p as unlockSfx, s as preloadChatAlert } from "./player-photo-BFw6nAbg.mjs";
import { $ as bottleItems, A as pushMusicHistoryLine, B as OPEN_BANK_EVENT, C as getSharedAudio, D as pushGiftLine, E as pushGestureLine, F as sendMusic, G as SourceDialogLayer, H as OPEN_TOPS_EVENT, I as setMusicMuted, J as SourceToastHost, K as SourceGiftLockedDialog, L as setMusicVolume, M as pushTextLine, N as registerMusicServices, O as pushHaremLine, P as removeTextLine, R as stampChatHistory, S as finishMusic, T as pushBottleLine, U as OPEN_VIP_EVENT, V as OPEN_DECOR_EVENT, W as SourceButtons, Y as showSourceToast, _ as prepareProfilePhoto, a as subscribeHeartAwards, at as turnOfferSound, b as batchChatHistory, buyBottle, c as buyTableBg, d as tableBgName, decide, deleteChatMessage, detachRoom, displaySeatOf, et as decisionArrowsVisible, f as tableBgThumbUrl, g as splitLeague, getRoom, h as canOpenLeague, i as setPendingGold, j as pushSystemLine, joinRoom, k as pushKickoutLine, l as fetchTableBgInfo, leaveRoomNow, loadRoomChatHistory, m as useTableBg, n as emitServerHeartAward, nt as leftRight, nudgeRoom, o as subscribePendingGold, onPremiumGift, onRoomChat, onRoomChatDelete, onRoomGesture, onRoomGift, onRoomHarem, onRoomKickout, ot as useBottle, p as tableBgUrl, premiumGiftInfo, profileBySeat, q as SourceInfoDialog, r as getPendingGold, rt as selectBottle, s as TABLE_BGS, sendChat, sendGesture, sendGift, sendPremiumGift, serverNow, spinBottle, st as waitingHint, t as revisionGuard, toDisplay, tt as decisionTimerVisible, u as headerBtnSvg, useIsChatAdmin, useRoom, v as executeSourceFeature, w as pushActionLine, x as expireChatHistory, y as useSourceFeatureSession, z as useMusicSession } from "./room-session-dbRRUfwK.mjs";
import { r as starsBankOptions } from "./stars-bank-DyTcXrMA.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CVtpY1Xi.mjs";
import "./router-BRjSPJZQ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game-Sgv98i7D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var VIEWER$1 = {
	id: "",
	playerNo: 0,
	name: "Sen",
	age: 25,
	male: true,
	photoUrl: DEFAULT_PHOTO
};
var VIEWER_STORE = {
	social: "ok",
	league: 0,
	maxLeague: 16
};
function setViewerProfile(p) {
	Object.assign(VIEWER$1, {
		id: p.id,
		playerNo: p.player_no,
		name: p.name,
		age: p.age ?? 0,
		male: p.male,
		photoUrl: p.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
	});
}
function isTelegramWebApp(win = window) {
	return Boolean(win.Telegram?.WebApp?.initData);
}
/**
* Original onIosKeyboardWillChangeFrame algorithm, verbatim:
* returns the smooth-scroll target that keeps the focused input above the
* keyboard, or null when no scroll is needed.
*/
function keyboardScrollTarget(keyboardHeight, scrollY, inputBottom, innerHeight) {
	const keyboardShift = Math.max(0, keyboardHeight - scrollY);
	if (keyboardShift <= 0) return null;
	const distanceToInput = inputBottom - innerHeight;
	if (distanceToInput > keyboardShift) return null;
	return Math.max(0, keyboardHeight - distanceToInput);
}
/**
* Original iosSafeArea.ts, verbatim: per-device portrait insets keyed by
* `screen.width x screen.height x devicePixelRatio`. Telegram iOS uses the
* bottom inset as the white strip under the chat input; unknown devices get
* no inset (the original only logs them).
*/
var IOS_PORTRAIT_SAFE_AREA = {
	"320x568x2": void 0,
	"320x693x3": [
		38,
		0,
		29,
		0
	],
	"375x667x2": void 0,
	"375x667x3": void 0,
	"375x812x2": [
		44,
		0,
		31,
		0
	],
	"375x812x3": [
		44,
		0,
		34,
		0
	],
	"390x844x3": [
		47,
		0,
		34,
		0
	],
	"393x852x3": [
		59,
		0,
		34,
		0
	],
	"402x874x3": [
		62,
		0,
		34,
		0
	],
	"414x736x3": void 0,
	"414x896x2": [
		48,
		0,
		34,
		0
	],
	"414x896x3": [
		44,
		0,
		34,
		0
	],
	"420x912x3": [
		68,
		0,
		34,
		0
	],
	"428x926x3": [
		47,
		0,
		34,
		0
	],
	"430x932x3": [
		59,
		0,
		34,
		0
	],
	"440x956x3": [
		62,
		0,
		34,
		0
	],
	"744x1133x2": void 0,
	"768x1024x2": void 0,
	"810x1080x2": void 0,
	"820x1180x2": void 0,
	"834x1112x2": void 0,
	"834x1194x2": void 0,
	"1024x1366x2": void 0
};
function iosPortraitSafeArea(w, h, dpr) {
	const v = IOS_PORTRAIT_SAFE_AREA[`${w}x${h}x${dpr}`];
	if (!v) return void 0;
	return {
		top: v[0],
		right: v[1],
		bottom: v[2],
		left: v[3]
	};
}
/** Original iosAppSafeArea(): device insets with top forced to 0. */
function iosAppSafeArea() {
	const sa = iosPortraitSafeArea(screen.width, screen.height, window.devicePixelRatio);
	return sa ? {
		...sa,
		top: 0
	} : void 0;
}
/**
* Android (and other non-iOS) Telegram builds: the white strip under the chat
* input equals Telegram's contentSafeAreaInset.bottom (gesture/navigation
* bar), falling back to safeAreaInset.bottom. Pure for testing.
*/
function telegramSafeAreaBottom(webApp, iosBottom = 0) {
	if (webApp.platform === "ios") return iosBottom || webApp.safeAreaInset?.bottom || 0;
	return webApp.contentSafeAreaInset?.bottom ?? webApp.safeAreaInset?.bottom ?? 0;
}
/**
* Sets up the Telegram viewport lock. Only runs inside the Mini App; the
* website build is untouched. Returns a cleanup function.
*/
function setupTelegramViewport() {
	if (!isTelegramWebApp()) {
		let cleanup = null;
		let tries = 0;
		const timer = setInterval(() => {
			tries++;
			if (isTelegramWebApp()) {
				clearInterval(timer);
				cleanup = startTelegramViewport();
			} else if (tries >= 50) clearInterval(timer);
		}, 100);
		return () => {
			clearInterval(timer);
			cleanup?.();
		};
	}
	return startTelegramViewport();
}
function startTelegramViewport() {
	const webApp = window.Telegram?.WebApp;
	if (!webApp) return () => void 0;
	webApp.ready?.();
	webApp.expand?.();
	webApp.disableVerticalSwipes?.();
	webApp.onEvent?.("viewportChanged", () => webApp.expand?.());
	const root = document.documentElement;
	root.classList.add("tg-webapp");
	const applySafeAreaBottom = () => {
		const bottom = telegramSafeAreaBottom(webApp, iosAppSafeArea()?.bottom ?? 0);
		if (bottom > 0) root.style.setProperty("--tg-safe-area-bottom", `${bottom}px`);
		else root.style.removeProperty("--tg-safe-area-bottom");
	};
	applySafeAreaBottom();
	webApp.onEvent?.("safeAreaChanged", applySafeAreaBottom);
	webApp.onEvent?.("contentSafeAreaChanged", applySafeAreaBottom);
	let stableHeight = window.innerHeight;
	const applyHeight = (h) => root.style.setProperty("--tg-app-height", `${h}px`);
	applyHeight(stableHeight);
	const vv = window.visualViewport;
	const onResize = () => {
		const current = vv ? vv.height : window.innerHeight;
		const keyboardHeight = Math.max(0, stableHeight - current);
		if (keyboardHeight < 80) {
			stableHeight = window.innerHeight;
			applyHeight(stableHeight);
			window.scrollTo({
				top: 0,
				left: 0
			});
			return;
		}
		applyHeight(stableHeight);
		const active = document.activeElement;
		if (!active) return;
		const rect = active.getBoundingClientRect();
		const target = keyboardScrollTarget(keyboardHeight, window.scrollY, rect.bottom, current);
		if (target !== null) window.scrollTo({
			top: target,
			left: 0,
			behavior: "smooth"
		});
	};
	vv?.addEventListener("resize", onResize);
	window.addEventListener("resize", onResize);
	return () => {
		vv?.removeEventListener("resize", onResize);
		window.removeEventListener("resize", onResize);
		root.classList.remove("tg-webapp");
		root.style.removeProperty("--tg-app-height");
		root.style.removeProperty("--tg-safe-area-bottom");
	};
}
var original_wood_table_default = "/assets/original-wood-table-CDD2962Q.png";
var VIEWER_STATUS_CHANGED = "viewer:status-changed";
var KEY = "bottle:viewer-progress";
var listeners$5 = /* @__PURE__ */ new Set();
var state$3 = {
	kisses: 0,
	vip: false,
	vipUntil: null,
	vipPlan: null,
	premium: false,
	premiumUntil: null
};
var loaded = false;
var watching = false;
var expiryTimer;
var emit$1 = () => listeners$5.forEach((l) => l());
var set$1 = (patch) => {
	state$3 = {
		...state$3,
		...patch
	};
	emit$1();
};
function load() {
	if (loaded || typeof window === "undefined") return;
	loaded = true;
	try {
		const kisses = Number(JSON.parse(window.localStorage.getItem(KEY) ?? "{}").kisses);
		if (Number.isFinite(kisses) && kisses > 0) state$3 = {
			...state$3,
			kisses: Math.floor(kisses)
		};
	} catch {}
}
function applyTimes(vipUntil, premiumUntil) {
	const now = Date.now();
	set$1({
		vipUntil,
		premiumUntil,
		vip: !!vipUntil && vipUntil > now,
		premium: !!premiumUntil && premiumUntil > now
	});
	window.clearTimeout(expiryTimer);
	const next = [vipUntil, premiumUntil].filter((t) => !!t && t > now).sort((a, b) => a - b)[0];
	if (next) expiryTimer = window.setTimeout(() => applyTimes(state$3.vipUntil, state$3.premiumUntil), Math.min(next - now + 50, 2 ** 31 - 1));
}
async function refreshViewerStatus() {
	const sb = getSupabase();
	if (!sb?.auth) return;
	const { data: u } = await sb.auth.getUser();
	if (!u.user) return applyTimes(null, null);
	let { data, error } = await sb.from("profiles").select("vip_until, vip_plan, premium_until").eq("id", u.user.id).maybeSingle();
	if (error) ({data} = await sb.from("profiles").select("vip_until, premium_until").eq("id", u.user.id).maybeSingle());
	const p = data;
	set$1({ vipPlan: p?.vip_plan ?? null });
	applyTimes(p?.vip_until ? Date.parse(p.vip_until) : null, p?.premium_until ? Date.parse(p.premium_until) : null);
}
function watch() {
	if (watching || typeof window === "undefined") return;
	watching = true;
	refreshViewerStatus();
	window.addEventListener(VIEWER_STATUS_CHANGED, () => void refreshViewerStatus());
	window.setInterval(() => void refreshViewerStatus(), 6e4);
	window.addEventListener("focus", () => void refreshViewerStatus());
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") refreshViewerStatus();
	});
}
function getViewerProgress() {
	load();
	return state$3;
}
var SERVER = {
	kisses: 0,
	vip: false,
	vipUntil: null,
	vipPlan: null,
	premium: false,
	premiumUntil: null
};
function useViewerProgress() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		watch();
		listeners$5.add(cb);
		return () => listeners$5.delete(cb);
	}, getViewerProgress, () => SERVER);
}
/** Server profile counter is the truth once signed in. */
function setViewerKisses(kisses) {
	load();
	if (state$3.kisses === kisses) return;
	set$1({ kisses: Math.max(0, Math.floor(kisses)) });
}
/** Remaining VIP time shown on the bought plan's button: "6g 23:59:59", under a day "23:59:59". */
function vipCountdown(ms) {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const d = Math.floor(total / 86400), h = Math.floor(total % 86400 / 3600), m = Math.floor(total % 3600 / 60), s = total % 60;
	const two = (n) => String(n).padStart(2, "0");
	return `${d > 0 ? `${d}g ` : ""}${two(h)}:${two(m)}:${two(s)}`;
}
/** Shows a price string with the platform currency word ("OK") replaced by the DAT coin icon. */
function DatPrice({ text }) {
	const parts = text.split(/\bOK\b/);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "dat-price",
		children: parts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.trim(), i < parts.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/assets/dat-coin-DArS5vpr.png",
			alt: "DAT",
			className: "dat-price__coin",
			width: 20,
			height: 20
		})] }, i))
	});
}
/** ReceivedGoldDialog.tsx: "Tebrikler!", package artwork, "<gold/> mükafatı qazandınız!", "Devam". */
function ReceivedGoldDialog({ assets, gold, position, onContinue }) {
	const t = (k) => translate(assets, k);
	const [before, after = ""] = t("html:dlg:gold:purchased2:v2").split("<gold/>");
	const go = (e) => onContinue({
		x: e.clientX,
		y: e.clientY
	});
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1001,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup-shade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("dlg:kiss_bonus:title"),
				className: "popup popup--center popup--show",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__header received-gold__x_popup__header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__title",
							children: t("dlg:kiss_bonus:title")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__close popup__close--dlg",
							role: "button",
							"aria-label": "Bağla",
							onClick: go,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__content popup__content--center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "received-gold",
							children: [typeof position === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "received-gold__image",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "received-gold__bg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "received-gold__bg-image" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `received-gold__opt-icon received-gold__opt-icon--${position + 1}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "received-gold__blicks",
										children: [
											1,
											2,
											3,
											4
										].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `received-gold__blick received-gold__blick--${n}` }, n))
									})
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `received-gold__image received-gold__image--${position}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "received-gold__context",
								children: [
									before,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "received-gold__heart",
										children: gold
									}),
									after
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__buttons popup__buttons--center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "button",
							className: "button button--confirm",
							onClick: go,
							children: t("dlg:gold:btn")
						})
					})
				]
			})]
		})
	}), document.body);
}
/** VipPresenter.showBought(): InfoDialog with imageId 'vip-purchase'. */
function VipBoughtDialog({ assets, onClose }) {
	const t = (k) => translate(assets, k);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1001,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("dlg:kiss_bonus:title"),
				className: "popup popup--center popup--show",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__title",
							children: t("dlg:kiss_bonus:title")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__close popup__close--dlg",
							role: "button",
							"aria-label": "Bağla",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__content popup__content--wrap popup__content--center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "info__image info__image--vip-purchase" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "info__context",
							children: t("html:dlg:vip:purchased")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__buttons popup__buttons--center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "button",
							className: "button button--confirm",
							onClick: onClose,
							children: t("dlg:gold:btn")
						})
					})
				]
			})]
		})
	}), document.body);
}
function telegramTopupUrl(amount, playerNo) {
	if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error("Etibarsız DAT miqdarı.");
	const text = `Salam! Deltagame.az oyun hesabıma ${amount} DAT yükləmək istəyirəm.${playerNo ? ` Oyunçu nömrəm: #${playerNo}.` : ""} Zəhmət olmasa, ödəniş məlumatlarını göndərin.`;
	return `https://t.me/deltagameadmin?text=${encodeURIComponent(text)}`;
}
/** Account linkage alone is enough: works inside Telegram and on the website (new tab). */
function shouldContactTelegramAdmin(insufficient, telegramId) {
	return insufficient && Boolean(telegramId);
}
function contactTelegramAdminOnInsufficient(message, datAmount) {
	const profile = getAuth().profile;
	const app = window.Telegram?.WebApp;
	if (!shouldContactTelegramAdmin(message.toLowerCase().includes("insufficient"), profile?.telegram_id)) return false;
	const url = telegramTopupUrl(datAmount, profile?.player_no);
	if (app?.openTelegramLink) app.openTelegramLink(url);
	else window.open(url, "_blank", "noopener");
	return true;
}
var SCROLL_INTERVAL = 5e3;
function vipDescriptions(t, lang = "en") {
	return {
		gifts: t("mobile:vip:hint1"),
		[`smile-${lang}`]: t("mobile:vip:hint2"),
		bottle: t("mobile:vip:hint3"),
		ribbon: t("mobile:vip:hint4"),
		tokens: t("mobile:vip:hint6")
	};
}
function vipOptions(t) {
	return [{
		id: "vip7",
		period: t("dlg:vip:option:1w"),
		isPopular: false,
		price: "120 OK",
		term: "нед."
	}, {
		id: "vip30",
		period: t("dlg:vip:option:1m"),
		isPopular: true,
		price: "390 OK",
		term: "мес."
	}];
}
function usePagerScroller() {
	const [selected, setSelected] = (0, import_react.useState)(0);
	const anim = (0, import_react.useRef)(null);
	const tid = (0, import_react.useRef)(0);
	const scroll = (0, import_react.useCallback)((from, to) => {
		if (anim.current) cancelAnimationFrame(anim.current);
		const t0 = performance.now();
		const step = () => {
			const k = Math.min(1, (performance.now() - t0) / 200);
			const e = 1 - (1 - k) * (1 - k);
			setSelected(from + e * (to - from));
			anim.current = k < 1 ? requestAnimationFrame(step) : null;
		};
		anim.current = requestAnimationFrame(step);
	}, []);
	const onScroll = (0, import_react.useCallback)((to) => {
		window.clearTimeout(tid.current);
		if (anim.current) return;
		setSelected(to);
		tid.current = window.setTimeout(() => {
			if (!anim.current) scroll(to, Math.round(to));
		}, 150);
	}, [scroll]);
	const selectedRef = (0, import_react.useRef)(selected);
	selectedRef.current = selected;
	return [
		selected,
		onScroll,
		(0, import_react.useCallback)((to) => scroll(selectedRef.current, to), [scroll])
	];
}
function Pager({ selected, onScroll, children }) {
	const ref = (0, import_react.useRef)(null);
	const programmatic = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		let ticking = false;
		const on = () => {
			if (programmatic.current) {
				programmatic.current = false;
				return;
			}
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				ticking = false;
				if (ref.current) onScroll(ref.current.scrollLeft / ref.current.offsetWidth);
			});
		};
		el.addEventListener("scroll", on, { passive: true });
		return () => el.removeEventListener("scroll", on);
	}, [onScroll]);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (el) {
			programmatic.current = true;
			el.scrollLeft = selected * el.offsetWidth;
		}
	}, [selected]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "pager vip__previews",
		children: children.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pager__page vip__preview",
			children: c
		}, i))
	});
}
function Controls({ numItems, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "page-scroller-controls__container vip__controls",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-scroller-controls__dots-container vip__pages-indicator",
			children: [Array.from({ length: numItems }, (_, i) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `page-scroller-controls__dot${Math.round(selected) === i ? "" : " page-scroller-controls__dot--clickable"}`,
					onClick: () => onSelect(i)
				}, i);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "page-scroller-controls__indicator",
				style: { left: 6 * selected + 12 * (selected + 1) }
			})]
		})
	});
}
function VipDialog({ assets, onClose, onBought }) {
	const t = (k) => translate(assets, k);
	const descriptions = vipDescriptions(t);
	const options = vipOptions(t);
	const pages = Object.keys(descriptions);
	const [selected, onScroll, onSelect] = usePagerScroller();
	const page = (0, import_react.useRef)(0);
	const bank = (0, import_react.useRef)(null);
	const [buttonWidth, setButtonWidth] = (0, import_react.useState)(0);
	const [bought, setBought] = (0, import_react.useState)(false);
	const viewer = useViewerProgress();
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (!viewer.vip) return;
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, [viewer.vip]);
	const busy = (0, import_react.useRef)(false);
	const buy = async (id) => {
		const sb = getSupabase();
		if (!sb || busy.current) return;
		busy.current = true;
		const { error } = await sb.rpc("buy_vip", { p_option: id });
		busy.current = false;
		if (error) {
			const selected = options.find((option) => option.id === id);
			const dat = selected ? Number.parseInt(selected.price, 10) : 0;
			if (dat > 0 && contactTelegramAdminOnInsufficient(error.message, dat)) return;
			showSourceToast(error.message.includes("insufficient") ? "Kifayət qədər DAT yoxdur." : "Alış baş tutmadı.");
			return;
		}
		window.dispatchEvent(new Event(VIEWER_STATUS_CHANGED));
		setBought(true);
		onBought?.();
	};
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			page.current = (page.current + 1) % pages.length;
			onSelect(page.current);
		}, SCROLL_INTERVAL);
		return () => window.clearInterval(id);
	}, [onSelect, pages.length]);
	(0, import_react.useEffect)(() => {
		if (!bank.current) return;
		const max = Math.max(...Array.from(bank.current.querySelectorAll(".button")).map((e) => e.clientWidth));
		if (buttonWidth < max) setButtonWidth(max);
	});
	(0, import_react.useEffect)(() => {
		const key = (e) => {
			if (e.key === "Escape") {
				e.stopImmediatePropagation();
				onClose();
			}
		};
		document.addEventListener("keydown", key, true);
		return () => document.removeEventListener("keydown", key, true);
	}, [onClose]);
	if (bought) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VipBoughtDialog, {
		assets,
		onClose
	});
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-feature-layer",
		style: { fontFamily: "Arial, Helvetica, sans-serif" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": t("mobile:bank:vip"),
			className: "popup vip__x_popup popup--center popup--show",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__header vip__x_popup__header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__title vip__x_popup__title",
					children: t("mobile:bank:vip")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__close popup__close--dlg",
					role: "button",
					"aria-label": "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__content vip__x_popup__content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vip__desc vip__desc--main",
					children: t("mobile:vip:desc1")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vip__offer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vip__media",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
							selected,
							onScroll,
							children: pages.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `vip__image vip__image--${d}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "vip__desc vip__desc--item",
								children: descriptions[d]
							})] }))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, {
							numItems: pages.length,
							selected,
							onSelect: (i) => {
								page.current = i;
								onSelect(i);
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "vip__bank",
						ref: bank,
						children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vip__item",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "vip__item-info",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vip__crown" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "vip__item-period",
										children: o.period
									}),
									o.isPopular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "vip__popular",
										children: t("bank:popular")
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "button",
								className: "button button--confirm vip__x_button",
								style: buttonWidth > 0 ? { width: buttonWidth } : void 0,
								onClick: () => void buy(o.id),
								children: viewer.vip && viewer.vipUntil && (viewer.vipPlan ?? "vip7") === o.id && viewer.vipUntil > now ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "vip__countdown",
									children: vipCountdown(viewer.vipUntil - now)
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatPrice, { text: `${o.price}/${o.term}` })
							})]
						}, o.id))
					})]
				})]
			})]
		})]
	}), document.body);
}
/** Port of DecorSelectionViewModel.Items from preloader.js. */
function buildDecorItems(assets, viewer) {
	const t = (key, ...args) => translate(assets, key, ...args);
	const items = [{
		type: "empty",
		price: { type: "open" },
		title: t("dlg:decor_selection:title:empty"),
		btnTitle: t("dlg:decor_selection:btn:apply"),
		description: t("dlg:decor_selection:desc:empty")
	}];
	for (const decor of assets.decor) {
		if (decor.social && decor.social.indexOf(viewer.social) === -1) continue;
		if (decor.league_s !== void 0 && decor.league_s > viewer.maxLeague) continue;
		const item = {
			type: decor.id,
			frame: assets.frames[decor.id],
			stone: assets.stones[decor.id],
			price: { type: "lock" },
			title: "",
			btnTitle: "",
			description: ""
		};
		if (decor.league_s) {
			const isSet = Boolean(item.frame && item.stone);
			const prefix = t(isSet ? "dlg:decor_selection:title:set" : "dlg:decor_selection:title:item");
			item.price = decor.league_s <= viewer.league ? { type: "open" } : { type: "lock" };
			item.btnTitle = t("dlg:decor_selection:btn:apply");
			item.title = `${prefix} ${t(`dlg:league:${decor.league_s}`)}`;
			item.description = t(isSet ? "dlg:decor_selection:desc:league_set" : "dlg:decor_selection:desc:league_item");
		} else if (decor.cond) {
			const owned = viewer.ownedItems.includes(decor.id);
			item.price = owned ? { type: "open" } : decor.storePrice ? {
				type: "open",
				price: decor.storePrice
			} : { type: "lock" };
			item.title = t("dlg:decor_selection:title:set", t(`decor:${decor.id}`));
			item.btnTitle = decor.storePrice && !owned ? t("dlg:decor_selection:btn:buy") : t("dlg:decor_selection:btn:apply");
			item.description = t(decor.cond === "pass" ? "dlg:decor_selection:desc:pass" : "dlg:decor_selection:desc:pass_buy");
		} else continue;
		items.push(item);
	}
	const giftLevel = viewer.giftLevel ?? 0;
	for (const entry of LEVEL_FRAMES) {
		const frame = assets.frames[entry.key];
		if (!frame) continue;
		const granted = viewer.ownedItems.includes(entry.key);
		const open = granted || isLevelFrameOpen(entry.level, giftLevel);
		items.push({
			type: entry.key,
			frame,
			stone: void 0,
			price: open ? { type: "open" } : { type: "lock" },
			title: `🏅 Səviyyə ${entry.level} ramkası`,
			btnTitle: t("dlg:decor_selection:btn:apply"),
			description: granted ? "Admin tərəfindən sənə verilib - ramka açıqdır" : open ? `Hədiyyə səviyyən ${entry.level}-ə çatıb - ramka açıqdır` : `Hədiyyə səviyyəsi ${entry.level}-də açılır`
		});
	}
	return items;
}
/** DecorSelectionViewModel.find(): the item matching an applied (frame, stone) pair. */
function findDecorItem(items, frame = "", stone = "") {
	return items.find((item) => (item.frame?.type || "") === frame && (item.stone?.type || "") === stone) ?? items[0];
}
/** Telegram Puanlar extra sections (ureyimsen TopsDialog: glv + activity). */
var LEVEL_POINTS = 1400;
/** Every heart spent on gifts is 1 level point; 1400 points = 1 level, capped at 100. */
function levelFromPoints(points) {
	return Math.min(100, Math.floor(Math.max(0, Number(points) || 0) / LEVEL_POINTS));
}
/** Original La.text: "{m} dəq", "{h} saat", "{h} saat {m} dəq". */
function activityText(minutes, hoursOnly = false) {
	const total = Math.max(0, Math.floor(Number(minutes) || 0));
	const h = Math.floor(total / 60), m = total % 60;
	if (!h) return `${m} dəq`;
	const hours = h.toLocaleString("tr-TR");
	return hoursOnly || !m ? `${hours} saat` : `${hours} saat ${m} dəq`;
}
/** Original score cell: activity -> time, glv -> "Lv N" (absolute list, level > 0), else the number. */
function extraScoreText(section, score, period) {
	if (section === "activity") return activityText(score);
	const level = period ? 0 : levelFromPoints(score);
	return level ? `Lv ${level}` : score.toLocaleString("tr-TR");
}
/** New accounts own nothing; ownership and the applied decor live on the server profile. */
var DEFAULT_STATE = {
	frame: "",
	stone: "",
	ownedItems: []
};
var state$2 = DEFAULT_STATE;
var listeners$4 = /* @__PURE__ */ new Set();
var emit = () => listeners$4.forEach((listener) => listener());
/** Mirror the confirmed server profile (realtime profile updates included). */
function syncDecorFromProfile(p) {
	const owned = p.owned_items ?? [];
	if (state$2.frame === p.frame && state$2.stone === p.stone && state$2.ownedItems.join() === owned.join()) return;
	state$2 = {
		frame: p.frame,
		stone: p.stone,
		ownedItems: owned
	};
	emit();
}
/** set_decor RPC: the server only accepts owned items (or empty). */
async function setDecorations(frame, stone) {
	const sb = getSupabase();
	if (!sb) return false;
	const { error } = await sb.rpc("set_decor", {
		p_frame: frame,
		p_stone: stone
	});
	if (error) return false;
	state$2 = {
		...state$2,
		frame,
		stone
	};
	emit();
	return true;
}
/** buy_decor RPC: price from the server list, hearts deducted in one transaction. */
async function purchaseItem(id) {
	const sb = getSupabase();
	if (!sb) return {
		ok: false,
		reason: "offline"
	};
	const { error } = await sb.rpc("buy_decor", { p_item: id });
	if (error) return {
		ok: false,
		reason: error.message
	};
	if (!state$2.ownedItems.includes(id)) state$2 = {
		...state$2,
		ownedItems: [...state$2.ownedItems, id]
	};
	emit();
	return { ok: true };
}
function subscribe(listener) {
	listeners$4.add(listener);
	return () => listeners$4.delete(listener);
}
function useDecorState() {
	return (0, import_react.useSyncExternalStore)(subscribe, () => state$2, () => DEFAULT_STATE);
}
/** Viewer gift level from the server (hearts spent on gifts); refreshed whenever the dialog opens. */
function useGiftLevel(open) {
	const [level, setLevel] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const sb = getSupabase();
		if (!sb) return;
		let alive = true;
		sb.rpc("my_gift_points").then(({ data, error }) => {
			if (alive && !error) setLevel(levelFromPoints(Number(data) || 0));
		});
		return () => {
			alive = false;
		};
	}, [open]);
	return level;
}
var bem$7 = (block) => (element, mods = [], modsOnly = false) => {
	const base = element ? `${block}__${element}` : block;
	return [modsOnly ? "" : base, ...mods.filter(Boolean).map((mod) => `${base}--${mod}`)].join(" ").trim();
};
var cls$7 = bem$7("decor-selection");
var previewCls$1 = bem$7("decor-preview");
function DialogImage({ assets, image, width, height, className }) {
	const data = dialogImage(assets, image, width, height);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className,
		src: data.src,
		width: data.width,
		height: data.height,
		alt: "",
		crossOrigin: "anonymous"
	});
}
function DialogButton$1({ type, enabled, title, className, onClick }) {
	const button = bem$7("button");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${button("", [type, enabled ? "" : "disabled"])} ${className}`,
		onClick,
		role: "button",
		"aria-disabled": !enabled,
		children: title
	});
}
function DecorPreview({ assets, decor, enabled, user, btn, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: previewCls$1("table"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: previewCls$1("photo_bg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: previewCls$1("photo"),
					style: { backgroundImage: `url("${user.photoUrl}")` }
				}), decor.frame && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogImage, {
					assets,
					className: previewCls$1("frame"),
					image: decor.frame.image
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: previewCls$1("name_bg"),
				children: [
					decor.stone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogImage, {
						assets,
						className: previewCls$1("stone"),
						image: decor.stone.image,
						width: 9,
						height: 9
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: previewCls$1("name"),
						children: user.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: previewCls$1("age"),
						children: [", ", user.age]
					}),
					decor.stone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogImage, {
						assets,
						className: previewCls$1("stone"),
						image: decor.stone.image,
						width: 9,
						height: 9
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: previewCls$1("control"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: previewCls$1("text"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: previewCls$1("desc"),
					children: [decor.description, decor.price.type === "open" && decor.price.price && decor.description.includes("{value}") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: previewCls$1("heart"),
						children: decor.price.price
					}) : null]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogButton$1, {
				type: "confirm",
				className: previewCls$1("button"),
				enabled,
				title: btn.title,
				onClick: btn.onApply
			})]
		})]
	});
}
var DecorPreviewAnimated = (0, import_react.forwardRef)(function DecorPreviewAnimated(props, ref) {
	const [animation, setAnimation] = (0, import_react.useState)(null);
	const [displayedDecor, setDisplayedDecor] = (0, import_react.useState)(props.decor);
	const latestDecor = (0, import_react.useRef)(props.decor);
	latestDecor.current = props.decor;
	(0, import_react.useImperativeHandle)(ref, () => ({ runApplyAnimation() {
		setAnimation("apply");
		window.setTimeout(() => setAnimation(null), 420);
	} }));
	(0, import_react.useEffect)(() => {
		setAnimation("hide");
		const id = window.setTimeout(() => {
			setDisplayedDecor(latestDecor.current);
			setAnimation("show");
		}, 126);
		return () => window.clearTimeout(id);
	}, [props.decor.type]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecorPreview, {
		...props,
		decor: {
			...displayedDecor,
			title: ""
		},
		className: `${previewCls$1("", [animation || false])} undefined`
	});
});
function ItemState({ decor, isApplied }) {
	const [isAppliedLocal, setIsAppliedLocal] = (0, import_react.useState)(isApplied);
	const [isAppliedHideAnimation, setIsAppliedHideAnimation] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isApplied === false && isAppliedLocal === true) {
			setIsAppliedHideAnimation(true);
			const id = window.setTimeout(() => {
				setIsAppliedHideAnimation(false);
				setIsAppliedLocal(false);
			}, 252);
			return () => window.clearTimeout(id);
		}
		setIsAppliedLocal(isApplied);
	}, [isApplied]);
	if (isAppliedLocal) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$7("icon-applied", [isAppliedHideAnimation && "hide"]) });
	if (decor.price.type === "lock") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$7("icon-lock") });
	if (decor.price.price) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls$7("price"),
		children: decor.price.price
	});
	return null;
}
var Item$2 = (0, import_react.forwardRef)(function Item({ assets, decor, isSelected, isApplied, onClick, style }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls$7("item", [isSelected && "selected", isApplied ? "show" : void 0]),
		style,
		ref,
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$7("images"),
			children: [decor.frame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogImage, {
				assets,
				className: cls$7("store-frame"),
				image: decor.frame.storeImage_v2,
				width: 42,
				height: 42
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$7("store-frame", ["empty"]) }), decor.stone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogImage, {
				assets,
				className: cls$7("store-stone"),
				image: decor.stone.storeImage,
				width: 20,
				height: 20
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$7("store-stone", ["empty"]) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cls$7("state"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemState, {
				isApplied,
				decor
			})
		})]
	});
});
function DecorSelectionDialog({ open, assets, items, activeItem, user, onApply, onClose }) {
	const [mounted, setMounted] = (0, import_react.useState)(open);
	const [phase, setPhase] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(activeItem);
	const previewRef = (0, import_react.useRef)(null);
	const selectedItemRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setPreview(activeItem);
			setMounted(true);
			setPhase("show");
			const id = window.setTimeout(() => setPhase(null), 300);
			return () => window.clearTimeout(id);
		}
		if (!mounted) return;
		setPhase("hide");
		const id = window.setTimeout(() => {
			setMounted(false);
			setPhase(null);
		}, 100);
		return () => window.clearTimeout(id);
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const keyboard = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", keyboard);
		return () => document.removeEventListener("keydown", keyboard);
	}, [open, onClose]);
	if (!mounted) return null;
	const apply = () => {
		onApply(preview);
		previewRef.current?.runApplyAnimation();
	};
	const shake = () => {
		const el = selectedItemRef.current;
		if (!el) return;
		el.classList.remove(cls$7("item", ["shake"], true));
		el.offsetHeight;
		el.classList.add(cls$7("item", ["shake"], true));
	};
	const canApply = preview.price.type === "open";
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1e3,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": preview.title,
				className: [
					"popup",
					cls$7("x_popup"),
					"popup--center",
					phase === "show" && "popup--show",
					phase === "hide" && "popup--hide"
				].filter(Boolean).join(" "),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `popup__header ${cls$7("x_popup__header")}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `popup__title ${cls$7("x_popup__title")}`,
							children: preview.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecorPreviewAnimated, {
							ref: previewRef,
							assets,
							decor: preview,
							enabled: preview.type !== activeItem.type && canApply,
							user,
							btn: {
								title: preview.btnTitle,
								onApply: canApply ? apply : shake
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__close popup__close--dlg",
							onClick: onClose,
							role: "button",
							"aria-label": "Bağla",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `popup__content popup__content--no-padding ${cls$7("x_popup__content")}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cls$7(""),
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$2, {
							ref: item.type === preview.type ? selectedItemRef : void 0,
							assets,
							decor: item,
							isSelected: preview.type === item.type,
							isApplied: item.type === activeItem.type,
							onClick: () => setPreview(item)
						}, item.type))
					})
				})]
			})]
		})
	}), document.body);
}
function useCilizAssets() {
	const [assets, setAssets] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		loadCilizAssets().then((value) => alive && setAssets(value), (error) => console.error("Game assets could not be loaded", error));
		return () => {
			alive = false;
		};
	}, []);
	return assets;
}
/** DecorSelectionPresenter: builds the items and applies the chosen decor. */
function DecorSelection({ open, onClose }) {
	const assets = useCilizAssets();
	const decor = useDecorState();
	const giftLevel = useGiftLevel(open);
	const items = (0, import_react.useMemo)(() => assets ? buildDecorItems(assets, {
		...VIEWER_STORE,
		ownedItems: decor.ownedItems,
		giftLevel
	}) : [], [
		assets,
		decor.ownedItems,
		giftLevel
	]);
	if (!assets || items.length === 0) return null;
	const activeItem = findDecorItem(items, decor.frame, decor.stone);
	const onApply = async (item) => {
		if (item.price.type === "open" && item.price.price && !decor.ownedItems.includes(item.type)) {
			const res = await purchaseItem(item.type);
			if (!res.ok) {
				if (res.reason.includes("insufficient")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
				else showSourceToast("Alış baş tutmadı.");
				return;
			}
		}
		if (item.price.type === "lock") {
			const entry = LEVEL_FRAMES.find((f) => f.key === item.type);
			if (entry) showSourceToast(`🔒 Bu ramka hədiyyə səviyyəsi ${entry.level}-də açılır (sənin səviyyən: ${giftLevel})`);
			return;
		}
		if (!await setDecorations(item.frame?.type || "", item.stone?.type || "")) showSourceToast("Tətbiq edilmədi.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecorSelectionDialog, {
		open,
		assets,
		items,
		activeItem,
		user: VIEWER$1,
		onApply,
		onClose
	});
}
var ui_btn_bg_up_default = "/assets/ui_btn_bg_up-Dz3OrZ68.svg";
var ui_btn_bg_down_default = "/assets/ui_btn_bg_down-ypCwPjVm.svg";
var ui_btn_gold_add_heart_down_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2022.1.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version='1.1'%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20width='62'%20height='55'%20viewBox='0%200%2062%2055'%20style='enable-background:new%200%200%2062%2055;'%20xml:space='preserve'%3e%3cstyle%20type='text/css'%3e%20.st0{fill:%23FFFFFF;}%20.st1{fill:%23FF6100;}%20.st2{opacity:0.8;fill:url(%23SVGID_1_);enable-background:new%20;}%20.st3{fill:url(%23SVGID_2_);}%20.st4{opacity:0.2;fill:%23FFFFFF;}%20%3c/style%3e%3cg%20id='Слой_2'%3e%3c/g%3e%3cg%20id='Слой_10'%3e%3c/g%3e%3cg%20id='Слой_11'%3e%3c/g%3e%3cg%20id='Слой_12'%3e%3c/g%3e%3cg%20id='Слой_3'%3e%3c/g%3e%3cg%20id='Слой_1'%3e%3cg%3e%3cg%3e%3cg%3e%3cpath%20class='st0'%20d='M31.1,54.6c1.7,0,3.2-0.7,4.4-1.8l21.3-21.5c3.4-3.5,5.2-8,5.2-12.8c0-10-8-18.1-17.9-18.1%20c-4.8,0-9.4,1.9-12.7,5.4l-0.3,0.3l-0.2-0.2C28,3,24.5,1.2,20.7,0.6c-0.9-0.1-1.9-0.2-2.8-0.2C8,0.4,0,8.5,0,18.5%20c0,4.8,1.9,9.4,5.2,12.8l21.3,21.5C27.8,54,29.3,54.6,31.1,54.6z'/%3e%3cg%3e%3cpath%20class='st1'%20d='M53.7,28.1c2.6-2.6,4-6.1,4-9.7c0-7.5-6.1-13.7-13.5-13.7c-3.6,0-7,1.4-9.5,4l-3.6,3.6L27.7,9%20C25.6,6.9,23,5.4,20,5C11.6,3.7,4.4,10.3,4.4,18.5c0,3.6,1.4,7.1,4,9.7l21.3,21.5c0.7,0.7,1.9,0.7,2.6,0L53.7,28.1z'/%3e%3c/g%3e%3cradialGradient%20id='SVGID_1_'%20cx='-2098.9087'%20cy='-54.022'%20r='19.3233'%20gradientTransform='matrix(-0.7452%20-0.6566%20-0.7701%200.8557%20-1559.7433%20-1291.8783)'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20style='stop-color:%23C44100'/%3e%3cstop%20offset='1'%20style='stop-color:%23FF6100'/%3e%3c/radialGradient%3e%3cpath%20class='st2'%20d='M53.7,28.1c2.6-2.6,4-6.1,4-9.7c0-7.5-6.1-13.7-13.5-13.7c-3.6,0-7,1.4-9.5,4l-3.6,3.6L27.7,9%20C25.6,6.9,23,5.4,20,5C11.6,3.7,4.4,10.3,4.4,18.5c0,3.6,1.4,7.1,4,9.7l21.3,21.5c0.7,0.7,1.9,0.7,2.6,0L53.7,28.1z'/%3e%3clinearGradient%20id='SVGID_2_'%20gradientUnits='userSpaceOnUse'%20x1='-1877.1024'%20y1='748.827'%20x2='-1845.7976'%20y2='696.561'%20gradientTransform='matrix(-0.9963%200%200%200.9872%20-1819.6769%20-688.634)'%3e%3cstop%20offset='0.4278'%20style='stop-color:%23FF613D;stop-opacity:0'/%3e%3cstop%20offset='1'%20style='stop-color:%23FFFFFF;stop-opacity:0.5'/%3e%3c/linearGradient%3e%3cpath%20class='st3'%20d='M53.7,28.1c2.6-2.6,4-6.1,4-9.7c0-7.5-6.1-13.7-13.5-13.7c-3.6,0-7,1.4-9.5,4l-3.6,3.6L27.7,9%20C25.6,6.9,23,5.4,20,5C11.6,3.7,4.4,10.3,4.4,18.5c0,3.6,1.4,7.1,4,9.7l21.3,21.5c0.7,0.7,1.9,0.7,2.6,0L53.7,28.1z'/%3e%3cpath%20class='st1'%20d='M50.6,25c1.7-1.8,2.7-4.1,2.7-6.6c0-5.1-4.1-9.2-9.1-9.2c-2.4,0-4.7,1-6.4,2.7l-6.7,6.7l-6.7-6.7%20c-1.7-1.7-4-2.7-6.4-2.7c-5,0-9.1,4.1-9.1,9.2c0,2.5,1,4.8,2.7,6.6l19.5,19.7L50.6,25z'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cpath%20class='st4'%20d='M31.1,54.6c1.7,0,3.2-0.7,4.4-1.8l21.3-21.5c3.4-3.5,5.2-8,5.2-12.8c0-10-8-18.1-17.9-18.1%20c-4.8,0-9.4,1.9-12.7,5.4l-0.3,0.3l-0.2-0.2C28,3,24.5,1.2,20.7,0.6c-0.9-0.1-1.9-0.2-2.8-0.2C8,0.4,0,8.5,0,18.5%20c0,4.8,1.9,9.4,5.2,12.8l21.3,21.5C27.8,54,29.3,54.6,31.1,54.6z'/%3e%3c/g%3e%3cg%20id='Слой_8'%3e%3c/g%3e%3cg%20id='Слой_9'%3e%3c/g%3e%3cg%20id='Слой_4'%3e%3c/g%3e%3cg%20id='Слой_5'%3e%3c/g%3e%3cg%20id='Слой_6'%3e%3c/g%3e%3cg%20id='Слой_7'%3e%3c/g%3e%3c/svg%3e";
var ui_btn_misc_menu_default = "data:image/svg+xml,%3csvg%20width='16'%20height='13'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3cg%20fill='%23E0B993'%20transform='translate(.5%20.5)'%3e%3crect%20y='10'%20width='15'%20height='2'%20rx='1'/%3e%3crect%20y='5'%20width='15'%20height='2'%20rx='1'/%3e%3crect%20width='15'%20height='2'%20rx='1'/%3e%3c/g%3e%3cg%20transform='translate(1%201)'%20fill='%23FFF'%3e%3crect%20y='10'%20width='14'%20height='1'%20rx='.5'/%3e%3crect%20y='5'%20width='14'%20height='1'%20rx='.5'/%3e%3crect%20width='14'%20height='1'%20rx='.5'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
var ui_btn_settings_default = "/assets/ui_btn_settings-DN9wpdr4.svg";
var ui_btn_change_table_default = "/assets/ui_btn_change_table-CX22mAZv.svg";
var ui_btn_roulette_default = "data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cdefs%3e%3cpath%20d='M0%200h16v16H0V0z'%20id='9we117sv0a'/%3e%3c/defs%3e%3cg%20fill='none'%20xlink:href='%239we117sv0a'%3e%3cpath%20d='M8%20.5a7.5%207.5%200%201%201-5.955%2012.061.578.578%200%200%201-.066-.261.5.5%200%200%201%20.928-.26%206.54%206.54%200%200%200%201.418%201.323l1.242-2.149a.5.5%200%200%201%20.866.5l-1.241%202.15c.85.408%201.802.636%202.808.636a6.475%206.475%200%200%200%202.807-.636l-1.24-2.15a.5.5%200%201%201%20.866-.5l1.241%202.148A6.495%206.495%200%200%200%2014.481%208.5H12a.5.5%200%201%201%200-1h2.481a6.495%206.495%200%200%200-2.807-4.863l-1.241%202.149a.5.5%200%200%201-.866-.5l1.24-2.15A6.475%206.475%200%200%200%208%201.5a6.475%206.475%200%200%200-2.809.636l1.242%202.15a.5.5%200%201%201-.866.5L4.325%202.637a6.537%206.537%200%200%200-1.404%201.305.511.511%200%200%201-.442.258.5.5%200%200%201-.393-.809A7.475%207.475%200%200%201%208%20.5z'%20fill='%23FFF'%20fill-rule='evenodd'/%3e%3cpath%20d='M8%200a8%208%200%201%201%200%2016c-2.52%200-4.847-1.173-6.4-3.213a1.073%201.073%200%200%201-.12-.487%201%201%200%200%201%201-1c.352%200%20.674.185.818.43.25.312.528.6.834.857l.042.035.96-1.658a1%201%200%200%201%201.261-.418l.105.052a1%201%200%200%201%20.366%201.366l-.96%201.66.047.018c.557.202%201.143.32%201.745.35L8%2014a5.99%205.99%200%200%200%202.045-.358l.046-.018-.957-1.66a1%201%200%200%201%20.268-1.302l.098-.064a1%201%200%200%201%201.366.366l.958%201.659.201-.173a5.99%205.99%200%200%200%201.891-3.446L12%209a1%201%200%200%201-.994-.883L11%208a1%201%200%200%201%201-1h1.916a5.985%205.985%200%200%200-1.891-3.45l-.201-.174-.958%201.66a1%201%200%200%201-1.262.418L9.5%205.402a1%201%200%200%201-.366-1.366l.958-1.661-.046-.017a5.974%205.974%200%200%200-1.744-.35L8%202a5.99%205.99%200%200%200-2.047.358l-.046.017.959%201.66a1%201%200%200%201-.269%201.303l-.097.064a1%201%200%200%201-1.366-.366l-.96-1.66-.035.03c-.299.25-.566.519-.784.785-.178.31-.51.509-.876.509a1%201%200%200%201-.787-1.616A7.974%207.974%200%200%201%208%200zm0%20.5a7.475%207.475%200%200%200-5.914%202.891.5.5%200%200%200%20.393.809c.19%200%20.355-.106.442-.258.401-.5.874-.94%201.404-1.305l1.242%202.149a.5.5%200%200%200%20.866-.5L5.19%202.136A6.475%206.475%200%200%201%208%201.5c1.005%200%201.957.228%202.807.636l-1.24%202.15a.5.5%200%201%200%20.866.5l1.24-2.149a6.495%206.495%200%200%201%202.808%204.864L12%207.5a.5.5%200%201%200%200%201h2.481a6.495%206.495%200%200%201-2.807%204.862l-1.241-2.148a.5.5%200%200%200-.866.5l1.24%202.15A6.475%206.475%200%200%201%208%2014.5a6.476%206.476%200%200%201-2.808-.636l1.24-2.15a.5.5%200%201%200-.865-.5l-1.242%202.149a6.54%206.54%200%200%201-1.418-1.323.5.5%200%200%200-.928.26c0%20.094.026.182.066.261A7.5%207.5%200%201%200%208%20.5z'%20fill='%23E0B993'/%3e%3cg%20fill-rule='evenodd'%3e%3cpath%20d='M2%2010.028a65.235%2065.235%200%200%200%201.89-1.18v.001a1%201%200%200%200-.01-1.686A60.794%2060.794%200%200%200%202%206.03C.5%205.164.211%206.582.211%208s.442%202.832%201.787%202.028z'%20fill='%23FFF'/%3e%3cpath%20d='M1.494%205.61c.655.273%201.605.803%202.854%201.587.113.07.21.162.284.27a.932.932%200%200%201-.277%201.325c-1.251.792-2.205%201.324-2.86%201.598C.254%2010.906.014%209.52%200%208.147v-.289C.015%206.484.254%205.093%201.494%205.61zm-.797.637C.541%206.598.47%207.18.47%207.962s.07%201.363.227%201.715c.131.295.24.342.57.206.575-.236%201.413-.69%202.505-1.361l.198-.123.078-.049a.456.456%200%200%200%20.181-.578l-.043-.074a.486.486%200%200%200-.142-.134c-1.233-.762-2.158-1.27-2.777-1.524-.33-.135-.439-.088-.57.207z'%20fill='%23E0B993'%20fill-rule='nonzero'/%3e%3c/g%3e%3ccircle%20fill='%23FFF'%20fill-rule='evenodd'%20cx='8'%20cy='8'%20r='1.5'/%3e%3cpath%20d='M8%206a2%202%200%201%201%200%204%202%202%200%200%201%200-4zm0%20.5a1.5%201.5%200%201%200%200%203%201.5%201.5%200%200%200%200-3z'%20fill='%23E0B993'/%3e%3c/g%3e%3c/svg%3e";
var original_menu_achievements_default = "data:image/svg+xml,Unauthorized";
var original_menu_tops_default = "data:image/svg+xml,Unauthorized";
var original_menu_bottle_default = "data:image/svg+xml,Unauthorized";
var items = [
	{
		id: "achievements",
		title: "Nailiyyətlər",
		key: "table:hint:achievement",
		icon: original_menu_achievements_default
	},
	{
		id: "tops",
		title: "Liderlər",
		key: "table:hint:top",
		icon: original_menu_tops_default
	},
	{
		id: "bottle",
		title: "Şüşə",
		key: "table:menu:change_bottle",
		icon: original_menu_bottle_default
	},
	{
		id: "tablebg",
		title: "Masa fonu",
		key: "",
		icon: original_menu_bottle_default
	},
	{
		id: "decor",
		title: "Stil",
		key: "table:menu:decor",
		icon: "data:image/svg+xml,Unauthorized"
	},
	{
		id: "boosters",
		title: "Gücləndiricilər",
		key: "table:menu:boosters",
		icon: "data:image/svg+xml,Unauthorized"
	}
];
function OriginalMiscMenu({ open, triggerRef, onClose, onSelect }) {
	const assets = useCilizAssets();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setMounted(true);
			return;
		}
		const timer = window.setTimeout(() => setMounted(false), 100);
		return () => window.clearTimeout(timer);
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!mounted) return;
		const position = () => {
			const menu = menuRef.current;
			const trigger = triggerRef.current;
			if (!menu || !trigger) return;
			const button = trigger.getBoundingClientRect();
			const header = trigger.closest(".original-table-header")?.getBoundingClientRect();
			const center = button.left + button.width / 2;
			const width = menu.offsetWidth;
			const left = window.innerWidth - center < width / 2 + 15 ? (window.innerWidth - width) / 2 : center - width / 2;
			menu.style.left = `${Math.max(0, left)}px`;
			menu.style.top = `${header?.bottom ?? button.bottom}px`;
		};
		position();
		window.addEventListener("resize", position);
		window.addEventListener("scroll", position, true);
		return () => {
			window.removeEventListener("resize", position);
			window.removeEventListener("scroll", position, true);
		};
	}, [mounted, triggerRef]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const outside = (event) => {
			if (!(event.target instanceof Node)) return;
			if (menuRef.current?.contains(event.target) || triggerRef.current?.contains(event.target)) return;
			onClose();
		};
		const keyboard = (event) => {
			if (event.key === "Escape") {
				onClose();
				triggerRef.current?.focus();
			}
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				const buttons = Array.from(menuRef.current?.querySelectorAll("button") ?? []);
				const current = buttons.findIndex((button) => button === document.activeElement);
				buttons[event.key === "ArrowDown" ? (current + 1) % buttons.length : current <= 0 ? buttons.length - 1 : current - 1]?.focus();
			}
		};
		document.addEventListener("mousedown", outside);
		document.addEventListener("touchstart", outside, { passive: true });
		document.addEventListener("keydown", keyboard);
		return () => {
			document.removeEventListener("mousedown", outside);
			document.removeEventListener("touchstart", outside);
			document.removeEventListener("keydown", keyboard);
		};
	}, [
		open,
		onClose,
		triggerRef
	]);
	if (!mounted) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: menuRef,
		id: "original-misc-menu",
		role: "dialog",
		"aria-label": "Masa menyusu",
		className: `original-misc-menu original-misc-menu--${open ? "show" : "hide"}`,
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "ghost",
			className: "original-misc-menu-item",
			onClick: () => {
				onClose();
				onSelect?.(item.id);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "original-misc-menu-icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: `original-misc-menu-image--${item.id}`
				})
			}), assets && item.key ? translate(assets, item.key) : item.title]
		}, item.id))
	}), document.body);
}
function BottleSelection({ open, onClose }) {
	const assets = useCilizAssets();
	const active = useBottle();
	const [notice, setNotice] = (0, import_react.useState)("");
	const [buying, setBuying] = (0, import_react.useState)(false);
	const room = useRoom();
	const { vip } = useViewerProgress();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const listRef = (0, import_react.useRef)(null);
	const dialogRef = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(null);
	const [box, setBox] = (0, import_react.useState)(null);
	const items = (0, import_react.useMemo)(() => assets ? bottleItems(assets, VIEWER_STORE.social, vip) : [], [assets, vip]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setNotice("");
		setScrolled(false);
		const place = () => {
			const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
			const game = document.querySelector(".original-game")?.getBoundingClientRect();
			if (!chat || !game) return;
			const viewport = window.visualViewport;
			const landscape = (viewport?.width ?? window.innerWidth) > (viewport?.height ?? window.innerHeight);
			const top = landscape ? game.top : chat.top;
			setBox({
				top,
				left: chat.left,
				width: chat.width,
				height: game.bottom - top,
				landscape
			});
		};
		const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const key = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopImmediatePropagation();
				onClose();
			}
			if (e.key !== "Tab") return;
			const controls = Array.from(dialogRef.current?.querySelectorAll("button:not(:disabled)") ?? []);
			const first = controls[0], last = controls[controls.length - 1];
			if (!first || !last) return;
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		const observer = new ResizeObserver(place);
		const game = document.querySelector(".original-game");
		const chat = document.querySelector(".original-chat");
		if (game) observer.observe(game);
		if (chat) observer.observe(chat);
		place();
		window.addEventListener("resize", place);
		document.addEventListener("keydown", key, true);
		window.visualViewport?.addEventListener("resize", place);
		window.visualViewport?.addEventListener("scroll", place);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", place);
			document.removeEventListener("keydown", key, true);
			window.visualViewport?.removeEventListener("resize", place);
			window.visualViewport?.removeEventListener("scroll", place);
			if (previousFocus?.isConnected) previousFocus.focus();
		};
	}, [open, onClose]);
	(0, import_react.useEffect)(() => {
		if (open && box && assets) closeRef.current?.focus({ preventScroll: true });
	}, [
		open,
		Boolean(box),
		Boolean(assets)
	]);
	(0, import_react.useLayoutEffect)(() => {
		const list = listRef.current;
		if (!list) return;
		const align = () => {
			const itemWidth = box?.landscape ? 77 : 90;
			const cols = Math.max(1, Math.floor(list.clientWidth / itemWidth));
			const spacing = Math.max(0, Math.floor((list.clientWidth - cols * itemWidth) / (cols + 1)));
			list.style.padding = `${spacing}px 0 ${spacing}px ${spacing}px`;
			Array.from(list.children).forEach((child) => {
				if (child instanceof HTMLElement) child.style.margin = `0 ${spacing}px ${spacing}px 0`;
			});
		};
		align();
		const observer = new ResizeObserver(align);
		observer.observe(list);
		return () => observer.disconnect();
	}, [
		open,
		box,
		items.length
	]);
	if (!open || !assets || !box) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bottle-drawer-overlay",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: dialogRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": translate(assets, "dlg:change_bottle:title"),
			className: `popup popup--absolute bottle-drawer${box.landscape ? " bottle-drawer--landscape" : ""}`,
			style: {
				top: box.top,
				left: box.left,
				width: box.width,
				height: box.height
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					ref: closeRef,
					variant: "ghost",
					className: "popup__close-drawer-bg",
					"aria-label": "Bağla",
					title: "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "popup__close popup__close--drawer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `popup__header send-gift__x_header${scrolled ? " popup__border--bottom" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__title popup__title--left send-gift__x_popup__title",
						children: translate(assets, "dlg:change_bottle:title")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__content popup__content--no-padding send-gift__x_popup__content",
					onScroll: (e) => setScrolled(e.currentTarget.scrollTop > 0),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: listRef,
						className: "send-gift send-gift--bottle",
						children: items.map((item) => {
							const image = dialogImage(assets, item.bottle.image, 70, 70);
							const locked = item.locked;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "send-gift__item bottle-store-item",
								"aria-label": item.name,
								title: item.name,
								"aria-pressed": active === item.bottle.type,
								onClick: () => {
									if (locked) {
										setNotice(translate(assets, "dlg:locked_bottle:vip:desc"));
										return;
									}
									if (active === item.bottle.type) {
										onClose();
										return;
									}
									const gold = room.players[5]?.gold;
									if (gold !== void 0 && gold < item.bottle.storePrice) {
										onClose();
										window.dispatchEvent(new Event(OPEN_BANK_EVENT));
										return;
									}
									if (buying) return;
									setBuying(true);
									buyBottle(item.bottle.type).then((res) => {
										setBuying(false);
										if (res.ok) {
											selectBottle(item.bottle.type);
											onClose();
											return;
										}
										if (res.reason.includes("insufficient")) {
											onClose();
											window.dispatchEvent(new Event(OPEN_BANK_EVENT));
										} else if (res.reason.includes("vip")) setNotice(translate(assets, "dlg:locked_bottle:vip:desc"));
										else setNotice("Şüşə dəyişdirilmədi.");
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "send-gift__image-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										className: `send-gift__image${locked ? " send-gift__image--locked" : ""}`,
										src: image.src,
										width: image.width,
										height: image.height,
										alt: ""
									})
								}), locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "send-gift__icon send-gift__icon--viplock" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `send-gift__subitem${item.bottle.storePrice ? "" : " send-gift__subitem--invisible"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "send-gift__icon send-gift__icon--heart" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "send-gift__price",
										children: item.bottle.storePrice
									})]
								})]
							}, item.bottle.type);
						})
					})
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "source-tops-notice",
					role: "status",
					children: notice
				})
			]
		})
	}), document.body);
}
var SEATS = Array.from({ length: 8 }, (_, i) => {
	const a = i / 8 * Math.PI * 2 - Math.PI / 2;
	return {
		left: `${50 + 39 * Math.cos(a)}%`,
		top: `${50 + 39 * Math.sin(a)}%`
	};
});
/** Port of ureyimsen's "Masa fonu" popup (preloader_new.js `vd`). */
function TableBgDialog({ onClose }) {
	const [info, setInfo] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		fetchTableBgInfo().then((d) => {
			if (alive) setInfo(d);
		});
		return () => {
			alive = false;
		};
	}, []);
	const current = info ? info.current : null;
	const price = info ? info.price : 500;
	const free = info?.free ?? 0;
	const confirm = async () => {
		if (busy || pending === null) return;
		setBusy(true);
		const r = await buyTableBg(pending);
		setBusy(false);
		if (r.ok) {
			onClose();
			if (!r.same) showSourceToast(`✨ Masa fonu dəyişdi: ${tableBgName(r.bg_type)}${r.free_used ? " (pulsuz)" : ""}`);
			return;
		}
		if (info && r.crystals !== void 0) setInfo({
			...info,
			crystals: r.crystals
		});
		setPending(null);
		showSourceToast(r.reason.includes("insufficient_crystals") ? "Kifayət qədər DAT yoxdur 🪙" : "Fon dəyişmədi, yenidən yoxla");
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "table-bg",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "table-bg__panel",
			role: "dialog",
			"aria-label": "Masa fonu",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "table-bg__head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-bg__title",
						children: "Masa fonu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "table-bg__close",
						onClick: onClose,
						"aria-label": "Bağla",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "table-bg__sub",
					children: [
						"Masadakı hamı görəcək · dəyişmək ",
						price,
						" DAT",
						info ? ` · DAT balansın: ${info.crystals}` : ""
					]
				}),
				free > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "table-bg__free",
					children: ["🎁 Köhnə fon üçün ödədiyin pula görə yeni fonlardan birini PULSUZ seçə bilərsən", free > 1 ? ` (${free} dəfə)` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-bg__grid",
					children: TABLE_BGS.map(([id, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `table-bg__item${id === current ? " table-bg__item--current" : ""}${id === pending ? " table-bg__item--pending" : ""}`,
						onClick: () => {
							if (!busy && id !== current && current !== null) setPending(id);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `table-bg__img${id ? "" : " table-bg__img--default"}`,
								style: id ? { backgroundImage: `url(${tableBgThumbUrl(id)})` } : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-bg__name",
								children: name
							}),
							id === current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-bg__badge",
								children: "Hazırkı"
							})
						]
					}, id || "default"))
				}),
				pending !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `table-bg__preview${pending ? "" : " table-bg__preview--default"}`,
					style: pending ? { backgroundImage: `url(${tableBgUrl(pending)})` } : void 0,
					children: [SEATS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-bg__pv-seat",
						style: s
					}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-bg__pv-bottle",
						children: "🍾"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "table-bg__confirm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-bg__confirm-text",
							children: free > 0 ? `“${tableBgName(pending)}” fonu PULSUZ qoyulsun?` : `“${tableBgName(pending)}” fonu ${price} DAT-a qoyulsun?`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "table-bg__yes",
							disabled: busy,
							onClick: () => void confirm(),
							children: busy ? "..." : "Bəli, dəyiş"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "table-bg__no",
							onClick: () => setPending(null),
							children: "Ləğv et"
						})
					]
				})] })
			]
		})
	}), document.body);
}
/** Stars fiyatı: Ciliz Telegram bankasındaki gibi yıldız ikonu + miktar. */
function StarPrice({ amount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "dat-price",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "bank__currency-icon bank__currency-icon--star",
			"aria-hidden": "true"
		}), amount] })
	});
}
var OK_PURCHASE_OPTIONS = [
	{
		real: 10,
		gold: 10,
		bonus: 0
	},
	{
		real: 50,
		gold: 50,
		bonus: 0
	},
	{
		real: 100,
		gold: 100,
		bonus: 10
	},
	{
		real: 200,
		gold: 200,
		bonus: 40,
		label: "hit"
	},
	{
		real: 500,
		gold: 500,
		bonus: 150
	},
	{
		real: 1e3,
		gold: 1e3,
		bonus: 350
	},
	{
		real: 5e3,
		gold: 5e3,
		bonus: 1750,
		label: "profitable"
	}
];
/** trans.translate('mobile:ok:bank:real', real) — the server string uses a bare "%" placeholder. */
function translatePrice(assets, real) {
	const text = assets.translation["mobile:ok:bank:real"] ?? "% OK";
	return text.includes("%0") ? text.replace("%0", String(real)) : text.replace("%", String(real));
}
function bankOptions(assets) {
	const sorted = [...OK_PURCHASE_OPTIONS].sort((a, b) => b.gold - a.gold);
	return sorted.map((o, i) => ({
		real: o.real,
		gold: o.gold,
		bonus: o.bonus,
		price: translatePrice(assets, o.real),
		idx: sorted.length - i,
		label: "label" in o ? {
			type: o.label,
			text: translate(assets, `bank:${o.label}`)
		} : void 0
	}));
}
/** BankOption: Math.round(bonus * 100 / gold) */
var bonusPercent = (gold, bonus) => Math.round(bonus * 100 / gold);
var createStarsInvoice = createServerFn({ method: "POST" }).inputValidator((input) => objectType({
	initData: stringType().min(10).max(4096),
	stars: numberType().int().positive()
}).parse(input)).handler(createSsrRpc("830bdcd890f1a4a529acf0dee21eb54d41570e4ae75a258531dc9fb58197c233"));
var PREMIUM_PRICE = 499;
function leftText(ms) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
	return d > 0 ? `${d} g. ${h} sa.` : h > 0 ? `${h} sa. ${m} dk.` : `${m} dk. ${sec} sn.`;
}
function useNow(on) {
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		if (!on) return;
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, [on]);
	return now;
}
function PremiumPassDialog({ t, onClose }) {
	const { premium, premiumUntil } = useViewerProgress();
	const now = useNow(premium);
	const busy = (0, import_react.useRef)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const buy = async () => {
		const sb = getSupabase();
		if (!sb || busy.current) return;
		busy.current = true;
		const { error } = await sb.rpc("buy_premium", { p_option: "pass30" });
		busy.current = false;
		if (error) {
			if (contactTelegramAdminOnInsufficient(error.message, PREMIUM_PRICE)) return;
			showSourceToast(error.message.includes("insufficient") ? "Kifayət qədər DAT yoxdur." : "Alış baş tutmadı.");
			return;
		}
		window.dispatchEvent(new Event(VIEWER_STATUS_CHANGED));
		setDone(true);
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1100,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("dlg:bottle_pass:premium_pass"),
				className: "popup popup--center popup--show info__x_popup",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__title",
							children: t("dlg:bottle_pass:premium_pass")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__close popup__close--dlg",
							role: "button",
							"aria-label": "Bağla",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__content",
						style: {
							textAlign: "center",
							padding: "12px 16px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bank__opt-icon bank__opt-icon--premium-pass",
								style: {
									position: "relative",
									margin: "0 auto 10px",
									left: "auto",
									top: "auto"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 14,
									lineHeight: 1.35
								},
								children: done ? t("dlg:premium_pass:purchased") : t("dlg:bottle_pass_info:desc2")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 13,
									marginTop: 8,
									opacity: .85
								},
								children: t("ok:premium:hint")
							}),
							premium && premiumUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bank__premium-pass-timer",
								style: {
									position: "static",
									marginTop: 10
								},
								children: leftText(premiumUntil - now)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__buttons",
						style: {
							display: "flex",
							justifyContent: "center",
							padding: "0 0 14px"
						},
						children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "button",
							className: "button button--confirm",
							onClick: onClose,
							children: t("dlg:navigate_vip:btn")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "button",
							className: "button button--confirm",
							onClick: () => void buy(),
							children: [premium ? "+30 g. " : "", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatPrice, { text: `${PREMIUM_PRICE} OK` })]
						})
					})
				]
			})]
		})
	}), document.body);
}
var bem$6 = (block) => (element = "", mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
var cls$6 = bem$6("bank");
var popup$3 = bem$6("popup");
var button = bem$6("button");
function usePopupPhase$2(open) {
	const [mounted, setMounted] = (0, import_react.useState)(open);
	const [phase, setPhase] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setMounted(true);
			setPhase("show");
			const id = window.setTimeout(() => setPhase(null), 300);
			return () => window.clearTimeout(id);
		}
		if (!mounted) return;
		setPhase("hide");
		const id = window.setTimeout(() => {
			setMounted(false);
			setPhase(null);
		}, 100);
		return () => window.clearTimeout(id);
	}, [open]);
	return {
		mounted,
		phase
	};
}
function DialogButton({ title, mods = [], onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "button",
		className: `${button("")} ${cls$6("x_button", mods)}`,
		onClick,
		children: title
	});
}
function BankDialog({ open, onClose, isVip, vipPurchased = false, onVip }) {
	const [assets, setAssets] = (0, import_react.useState)(null);
	const { mounted, phase } = usePopupPhase$2(open);
	(0, import_react.useEffect)(() => {
		if (open && !assets) loadCilizAssets().then(setAssets).catch(() => void 0);
	}, [open, assets]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const key = (e) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [open, onClose]);
	const [received, setReceived] = (0, import_react.useState)(null);
	const busy = (0, import_react.useRef)(false);
	const [premiumOpen, setPremiumOpen] = (0, import_react.useState)(false);
	const viewer = useViewerProgress();
	const now = useNow(open && viewer.premium);
	const buy = async (real, position) => {
		const sb = getSupabase();
		if (!sb || busy.current) return;
		busy.current = true;
		const { data, error } = await sb.rpc("buy_gold", { p_real: real });
		busy.current = false;
		if (error) {
			if (contactTelegramAdminOnInsufficient(error.message, real)) return;
			showSourceToast(error.message.includes("insufficient") ? "Kifayət qədər DAT yoxdur." : "Alış baş tutmadı.");
			return;
		}
		const got = Number(data);
		setPendingGold(got);
		onClose();
		setReceived({
			gold: got,
			position
		});
	};
	const confirmStarsPayment = async (totalGold, position) => {
		const sb = getSupabase();
		if (!sb) return;
		const { data: u } = await sb.auth.getUser();
		if (!u.user) return;
		const { data: before } = await sb.from("profiles").select("gold").eq("id", u.user.id).maybeSingle();
		const startGold = Number(before?.gold ?? 0);
		for (let i = 0; i < 12; i++) {
			await new Promise((r) => setTimeout(r, 1e3));
			const { data: row } = await sb.from("profiles").select("gold").eq("id", u.user.id).maybeSingle();
			if (Number(row?.gold ?? 0) >= startGold + totalGold) {
				setPendingGold(totalGold);
				onClose();
				setReceived({
					gold: totalGold,
					position
				});
				return;
			}
		}
		showSourceToast("Ödəniş qəbul edildi; ürəklər tezliklə hesabınıza əlavə olunacaq.");
	};
	const buyStars = async (stars, totalGold, position) => {
		if (busy.current) return;
		const app = window.Telegram?.WebApp;
		const initData = app?.initData ?? "";
		if (!initData || !app?.openInvoice) {
			showSourceToast("Ödəniş yalnız Telegram daxilində mümkündür.");
			return;
		}
		busy.current = true;
		try {
			const { link } = await createStarsInvoice({ data: {
				initData,
				stars
			} });
			busy.current = false;
			app.openInvoice(link, (status) => {
				if (status === "paid") confirmStarsPayment(totalGold, position);
				else if (status === "failed") showSourceToast("Ödəniş tamamlanmadı.");
			});
		} catch (e) {
			busy.current = false;
			showSourceToast(gameError(e));
		}
	};
	const receivedDialog = received && assets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivedGoldDialog, {
		assets,
		gold: received.gold,
		position: received.position,
		onContinue: async (pt) => {
			const r = received;
			setReceived(null);
			const sb = getSupabase();
			if (!sb) return;
			const { data } = await sb.auth.getUser();
			emitServerHeartAward({
				id: `buy:${Date.now()}:${Math.random()}`,
				viewerId: data.user?.id ?? "",
				amount: r.gold,
				lucky: false,
				prepaid: true,
				from: pt
			});
		}
	}) : null;
	const premiumDialog = premiumOpen && assets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumPassDialog, {
		t: (k) => translate(assets, k),
		onClose: () => setPremiumOpen(false)
	}) : null;
	if (!mounted || !assets) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [receivedDialog, premiumDialog] });
	const t = (key) => translate(assets, key);
	const items = isTelegramWebApp() ? starsBankOptions().map((o) => ({
		key: `s${o.stars}`,
		gold: o.gold,
		bonus: o.bonus,
		idx: o.idx,
		label: o.label ? {
			type: o.label.type,
			text: t(`bank:${o.label.type}`)
		} : void 0,
		price: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarPrice, { amount: o.stars }),
		onBuy: () => void buyStars(o.stars, o.gold + o.bonus, o.idx - 1)
	})) : bankOptions(assets).map((o) => ({
		key: `d${o.real}`,
		gold: o.gold,
		bonus: o.bonus,
		idx: o.idx,
		label: o.label,
		price: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatPrice, { text: o.price }),
		onBuy: () => void buy(o.real, o.idx - 1)
	}));
	const bonusDesc = t("bank:bonus:big");
	const itemsNum = items.length + (isVip ? 1 : 0) + 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		receivedDialog,
		premiumDialog,
		(0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 1e3,
				fontFamily: "Arial, Helvetica, sans-serif"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__dialog-manager",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup-shade",
					onClick: onClose
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("bank:title"),
					className: [
						"popup",
						cls$6("x_popup"),
						"popup--center",
						phase === "show" && "popup--show",
						phase === "hide" && "popup--hide"
					].filter(Boolean).join(" "),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("bg") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `${popup$3("header")} ${cls$6("x_popup__header")}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `${popup$3("title")} ${cls$6("x_popup__title")}`,
								children: t("bank:title")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: popup$3("close", ["dlg"]),
								role: "button",
								"aria-label": "Bağla",
								onClick: onClose,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${popup$3("close-icon")} ${cls$6("x_popup__close-icon")}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${popup$3("content")} ${cls$6("x_popup__content")}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cls$6("items-container", [itemsNum > 8 && "many-items"]),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cls$6("item"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("item-bg", ["gold"]) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cls$6("desc"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cls$6("premium-pass"),
													children: t("dlg:bottle_pass:premium_pass").toLocaleUpperCase("tr-TR")
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("opt-icon", ["premium-pass"]) }),
											viewer.premium && viewer.premiumUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cls$6("premium-pass-timer"),
												children: leftText(viewer.premiumUntil - now)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("purchased") })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogButton, {
												title: t("mobile:vip:know"),
												mods: ["vip"],
												onClick: () => setPremiumOpen(true)
											})
										]
									}),
									isVip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cls$6("item"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("item-bg", ["gold"]) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cls$6("desc"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cls$6("vip"),
													children: t("dlg:needvip:title")
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cls$6("bonus", ["vip"]),
													children: t("bank:vip:status")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("opt-icon", ["vip"]) }),
											(vipPurchased || viewer.vip) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("purchased") }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogButton, {
												title: t("mobile:vip:know"),
												mods: ["vip"],
												onClick: onVip ?? onClose
											})
										]
									}),
									items.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cls$6("item"),
										children: [
											opt.label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cls$6("label", [opt.label.type]),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("label-blick") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: cls$6("label-text"),
													children: opt.label.text
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("item-bg", ["gold"]) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cls$6("desc"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cls$6("gold"),
													children: opt.gold + opt.bonus
												}), opt.bonus > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: cls$6("bonus"),
													children: [
														bonusPercent(opt.gold, opt.bonus),
														"% ",
														bonusDesc
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cls$6("opt-icon", [String(opt.idx)]),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: cls$6("blicks"),
													children: [
														1,
														2,
														3,
														4
													].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$6("blick", [String(n)]) }, n))
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogButton, {
												title: opt.price,
												onClick: opt.onBuy
											})
										]
									}, opt.key))
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
					]
				})]
			})
		}), document.body)
	] });
}
var EXTRA_HELP = {
	glv: {
		title: "Səviyyə liderləri",
		text: "Hədiyyə atdıqca səviyyən qalxır: hədiyyəyə xərclənən hər ürək 1 səviyyə xalıdır, 1400 xal 1 səviyyədir (maksimum 100). Ümumi siyahıda səviyyəyə (bərabər səviyyədə xala), dövri siyahılarda həmin dövrdə qazanılan xala görə sıralanır."
	},
	activity: {
		title: "Aktivlik liderləri",
		text: "Oyunda keçirdiyin hər dəqiqə sayılır. Ümumi siyahı bütün vaxt üzrə, aylıq, həftəlik və günlük siyahılar həmin dövrdə oyunda keçirilən vaxta görə sıralanır."
	}
};
/** TopsPresenter.showHelp -> InfoDialog, using the original translation keys. */
function SourceTopsHelp({ category, assets, onClose }) {
	const dialogRef = (0, import_react.useRef)(null);
	const extra = EXTRA_HELP[category];
	const title = extra ? extra.title : translate(assets, `dlg:top:help:${category}:title`);
	const context = extra ? extra.text : `${translate(assets, `dlg:top:help:${category}:text`)}\n\n${translate(assets, "dlg:top:help:text:common")}`;
	(0, import_react.useEffect)(() => {
		const previous = document.activeElement;
		dialogRef.current?.focus();
		const keyboard = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopImmediatePropagation();
				onClose();
			}
			if (event.key !== "Tab") return;
			const controls = Array.from(dialogRef.current?.querySelectorAll("button") ?? []);
			const first = controls[0], last = controls[controls.length - 1];
			if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first?.focus();
			}
		};
		document.addEventListener("keydown", keyboard, true);
		return () => {
			document.removeEventListener("keydown", keyboard, true);
			if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
		};
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-tops-help-layer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			ref: dialogRef,
			tabIndex: -1,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			className: "popup popup--center source-tops-help-popup",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "popup__close popup__close--dlg",
					"aria-label": "Liderlər haqqında məlumatı bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "popup__header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__title",
						children: title
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__content popup__content--wrap popup__content--center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "info__context",
						children: context
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__buttons popup__buttons--center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "button button--confirm",
						onClick: onClose,
						children: translate(assets, "dlg:navigate_vip:btn")
					})
				})
			]
		})]
	});
}
function topRankingRows(rows) {
	return rows.map((row) => ({
		...row,
		score: Number(row.score),
		rank: Number(row.rank)
	})).sort((a, b) => a.rank - b.rank);
}
var sections = [
	{
		id: "total_kisses",
		title: "dlg:top:title"
	},
	{
		id: "dj_score",
		title: "dlg:top:title:dj"
	},
	{
		id: "price",
		title: "dlg:top:title:price"
	},
	{
		id: "harem_price",
		title: "dlg:top:title:harem_price"
	},
	{
		id: "gestures",
		title: "dlg:top:title:gestures"
	}
];
var telegramSections = [{
	id: "glv",
	title: "Səviyyə liderləri"
}, {
	id: "activity",
	title: "Aktivlik liderləri"
}];
var isExtra = (id) => id === "glv" || id === "activity";
var PERIODLESS = ["price", "harem_price"];
function SourceTopsDialog({ onClose }) {
	const assets = useCilizAssets();
	const [viewerId, setViewerId] = (0, import_react.useState)();
	const [section, setSection] = (0, import_react.useState)(sections[0]);
	const [telegram, setTelegram] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setTelegram(isTelegramWebApp()), []);
	const tabs = telegram ? [...sections, ...telegramSections] : sections;
	const title = (item) => isExtra(item.id) ? item.title : translate(assets, item.title);
	const [period, setPeriod] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)("Yüklənir…");
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb) return;
		let alive = true;
		const revision = revisionGuard();
		const load = async () => {
			const read = revision.next();
			const [{ data: u }, { data, error }] = await Promise.all([sb.auth.getUser(), sb.rpc(isExtra(section.id) ? "top_players_extra" : "top_players", {
				p_section: section.id,
				p_period: period
			})]);
			if (!alive || !revision.current(read)) return;
			setViewerId(u.user?.id);
			if (error) {
				setNotice("Liderlər siyahısı yüklənmədi.");
				return;
			}
			setRows(topRankingRows(data ?? []).map((r) => ({
				id: r.id,
				name: r.name,
				photo: r.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K",
				score: r.score,
				rank: r.rank
			})));
			setNotice((data ?? []).length ? null : "Hələ nəticə yoxdur.");
		};
		setNotice("Yüklənir…");
		load();
		const id = window.setInterval(() => void load(), 5e3);
		return () => {
			alive = false;
			window.clearInterval(id);
		};
	}, [section, period]);
	const [help, setHelp] = (0, import_react.useState)(false);
	const closeRef = (0, import_react.useRef)(onClose);
	(0, import_react.useEffect)(() => {
		closeRef.current = onClose;
	}, [onClose]);
	(0, import_react.useEffect)(() => {
		const key = (event) => {
			if (event.key === "Escape") closeRef.current();
		};
		document.addEventListener("keydown", key);
		return () => {
			document.removeEventListener("keydown", key);
		};
	}, []);
	if (!assets) return null;
	const ranked = [...rows.filter((row) => row.rank > 0), ...rows.filter((row) => row.rank <= 0)];
	const visible = ranked.slice(0, 50);
	const self = ranked.find((row) => row.id === viewerId);
	if (self && !visible.includes(self)) visible.push(self);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-tops-layer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				role: "dialog",
				"aria-modal": !help,
				inert: help,
				"aria-label": "Liderlər",
				className: "popup popup--center top-dlg__x_popup",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "popup__header top-dlg__x_popup__header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "popup__close popup__close--dlg",
							"aria-label": "Liderlər siyahısını bağla",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "top-dlg__x_popup__close-icon" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "top-dlg__help",
							"aria-label": "Liderlər haqqında məlumat",
							"aria-haspopup": "dialog",
							onClick: () => setHelp(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "top-dlg__help-icon" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "top-dlg__tabs",
							role: "tablist",
							"aria-label": "Reytinq kateqoriyası",
							children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								role: "tab",
								"aria-selected": section.id === item.id,
								"aria-label": title(item),
								title: title(item),
								className: `top-dlg__tab top-dlg__tab--${item.id}${section.id !== item.id ? ` top-dlg__tab--${item.id}-inactive` : ""}`,
								onClick: () => {
									setSection(item);
									setPeriod("");
									setHelp(false);
								}
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "top-dlg__desc",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "top-dlg__title",
								children: title(section)
							}), !PERIODLESS.includes(section.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Reytinq dövrü",
								className: "top-dlg__period",
								value: period,
								onChange: (event) => setPeriod(event.target.value),
								children: [
									"",
									"monthly",
									"weekly",
									"daily"
								].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value,
									children: translate(assets, `dlg:top:${value || "absolute"}`)
								}, value))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "top-dlg__content top-dlg__bg",
					children: notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "source-tops-notice",
						role: "status",
						children: notice
					}) : visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `top-dlg__item${row.id === viewerId ? " top-dlg__item--sticked" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "top-dlg__photo",
							src: row.photo,
							alt: row.name,
							style: { cursor: "pointer" },
							onClick: () => {
								onClose();
								window.dispatchEvent(new CustomEvent("source:open-profile", { detail: row.id }));
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `top-dlg__user-info${row.id === viewerId ? " top-dlg__user-info--viewer" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "top-dlg__rank",
									children: row.rank > 0 ? `${row.rank}. ` : ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "top-dlg__name",
									children: row.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `top-dlg__icon top-dlg__icon--${section.id}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `top-dlg__score top-dlg__score--${section.id}`,
									children: isExtra(section.id) ? extraScoreText(section.id, row.score, period) : row.score.toLocaleString("tr-TR")
								})
							]
						})]
					}, row.id))
				})]
			}),
			help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTopsHelp, {
				category: section.id,
				assets,
				onClose: () => setHelp(false)
			})
		]
	}), document.body);
}
var ORDER = [
	"kiss_fire",
	"refuse_slap",
	"league5",
	"league_kiss2x",
	"league_kiss_lim10"
];
function Popup({ title, onClose, children, help, nested = false }) {
	(0, import_react.useEffect)(() => {
		if (nested) return;
		const previous = document.activeElement;
		const key = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopImmediatePropagation();
				onClose();
			}
		};
		document.addEventListener("keydown", key, true);
		return () => {
			document.removeEventListener("keydown", key, true);
			if (previous instanceof HTMLElement) previous.focus();
		};
	}, [onClose, nested]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-boosters-layer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": !nested,
			inert: nested,
			"aria-label": title,
			className: "popup popup--center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "popup__close popup__close--dlg",
					"aria-label": "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "popup__header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__title",
						children: title
					}), help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "boosters-list__manual",
						"aria-label": "Gücləndirici nədir?",
						onClick: help
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__content",
					children
				})
			]
		})]
	});
}
function Item$1({ assets, booster, onClick, info = false }) {
	const image = dialogImage(assets, booster.image, 60, 60);
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "booster-item__image",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: image.src,
			width: image.width,
			height: image.height,
			alt: ""
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "booster-item__hint booster-item__hint--counter-grey",
			children: "—"
		})]
	});
	return onClick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		className: "booster-item booster-item--list booster-item--clickable",
		"aria-label": translate(assets, `dlg:booster_info:${booster.type}:title`),
		onClick,
		children: content
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `booster-item booster-item--${info ? "info" : "list"}`,
		children: content
	});
}
/** Original inventory and help. Unknown inventory is never substituted with owned boosters. */
function SourceBoostersDialog({ onClose }) {
	const assets = useCilizAssets();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [help, setHelp] = (0, import_react.useState)(false);
	if (!assets) return null;
	const entries = ORDER.flatMap((id) => assets.boosters?.[id] ? [[id, assets.boosters[id]]] : []);
	const current = selected ? assets.boosters?.[selected] : void 0;
	const categories = ["choice", "league"];
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
			title: translate(assets, "table:menu:boosters"),
			onClose,
			nested: Boolean(current || help),
			help: () => setHelp(true),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "boosters-list",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "boosters-list__subtitle",
					children: translate(assets, "dlg:boosters:desc")
				}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "boosters-category-group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "boosters-list__category",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "boosters-list__cat-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "boosters-list__cat-title",
								children: translate(assets, `dlg:boosters:section:${category}`)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "boosters-list__cat-border" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "boosters-list__cat-items",
						children: entries.filter(([, b]) => b.category === category).map(([id, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
							assets,
							booster: b,
							onClick: () => setSelected(id)
						}, id))
					})]
				}, category))]
			})
		}),
		current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
			title: translate(assets, `dlg:booster_info:${selected}:title`),
			onClose: () => setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "booster",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
						assets,
						booster: current,
						info: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "booster__description",
						children: translate(assets, `dlg:booster_info:${selected}:desc`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `booster__info${current.category === "choice" ? " booster__info--disabled" : ""}`,
						children: translate(assets, current.category === "choice" ? "dlg:booster_info:table_activation:info" : "dlg:booster_info:not_in_leagues:info")
					})
				]
			})
		}),
		help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
			title: translate(assets, "dlg:boosters_help:header"),
			onClose: () => setHelp(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "boosters-help",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "boosters-help__subtitle",
					children: translate(assets, "dlg:boosters_help:desc")
				}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "boosters-help__category",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "boosters-help__category-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "boosters-help__category-title",
								children: translate(assets, `dlg:boosters:section:${category}`)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "boosters-help__category-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "boosters-help__category-desc",
						children: translate(assets, `dlg:boosters_help:${category}_desc`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "boosters-help__category-items",
						children: entries.filter(([, b]) => b.category === category).map(([id, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "boosters-help__category-item",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
								assets,
								booster: b
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "boosters-help__category-item-info",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `boosters-help__category-item-title boosters-help__category-item-title--${category}`,
									children: translate(assets, `dlg:booster_info:${id}:title`)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "boosters-help__category-item-desc",
									children: translate(assets, `dlg:booster_info:${id}:desc`)
								})]
							})]
						}, id))
					})
				] }, category))]
			})
		})
	] }), document.body);
}
var empty$1 = {
	verified: false,
	completed: []
};
var adapter$1 = null;
var snapshot = empty$1;
var unsubscribe;
var listeners$3 = /* @__PURE__ */ new Set();
function attachAchievementSession(next) {
	unsubscribe?.();
	adapter$1 = next;
	const notify = () => {
		snapshot = next?.getSnapshot() ?? empty$1;
		listeners$3.forEach((fn) => fn());
	};
	unsubscribe = next?.subscribe(notify);
	notify();
}
function useAchievementSession() {
	return (0, import_react.useSyncExternalStore)((fn) => {
		listeners$3.add(fn);
		return () => {
			listeners$3.delete(fn);
		};
	}, () => snapshot, () => empty$1);
}
async function acknowledgeAchievement(id, level) {
	if (!adapter$1 || !snapshot.verified) throw new Error("Oyunçu hesabına giriş edilməyib.");
	await adapter$1.acknowledge(id, level);
}
/** Source TranslatorTemplate: %N args, %b(male|female), %N`d(...)` treated as plain arg. */
function tr(assets, key, ...args) {
	return (assets.translation[key] ?? key).replace(/%(\d*)(?:([bd])\(([^)]*)\))?/g, (_m, i, kind, opts) => {
		const arg = args[Number(i) || 0];
		if (kind === "b") return (opts ?? "").split("|")[arg ? 0 : 1] ?? "";
		if (kind === "d") return (opts ?? "").split("|")[0] ?? "";
		return arg === void 0 ? "" : String(arg);
	});
}
var STAR_PAD = {
	3: 3,
	5: 2,
	7: 1
};
function select(v, male, a, level) {
	let value = v ?? (male ? a.image_male : a.image_female);
	if (Array.isArray(value)) value = value[Math.max(level, 0)];
	return value ?? "";
}
function buildItems(assets, male, completed = []) {
	const now = Date.now();
	return Object.entries(assets.achievements ?? {}).filter(([id, a]) => a.since_ms === void 0 || a.since_ms <= now || completed.some((row) => row.achievement_id === id)).map(([id, a]) => {
		const verifiedLevel = completed.filter((row) => row.achievement_id === id).reduce((max, row) => Math.max(max, row.level), -1);
		const maxLevel = a.counters?.length ?? 1;
		const level = Math.max(0, Math.min(verifiedLevel, maxLevel - 1));
		const nameKey = a.name_depends_on_level ? `achievement:${id}:name:${level}` : `achievement:${id}:name`;
		let counter = a.counters?.[verifiedLevel >= 0 && level < maxLevel - 1 ? level + 1 : level];
		if (a.translate_counters && typeof counter === "string") counter = tr(assets, counter);
		const term = a.counters ? tr(assets, `achievement:${id}:terms`, counter ?? "") : tr(assets, `achievement:${id}:terms`);
		return {
			id,
			asset: a,
			level,
			maxLevel,
			disabled: verifiedLevel < 0,
			name: tr(assets, nameKey, male),
			image: select(a.image, male, a, level),
			term
		};
	});
}
function Stars({ item }) {
	const pad = STAR_PAD[item.maxLevel] ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "achievement-item__stars",
		children: Array.from({ length: item.maxLevel }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `achievement-item__star achievement-item__star--${i + pad}${i <= item.level && !item.disabled ? " achievement-item__star--active" : ""}` }, i))
	});
}
function useEscape(onClose, enabled = true) {
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const key = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopImmediatePropagation();
				onClose();
			}
		};
		document.addEventListener("keydown", key, true);
		return () => document.removeEventListener("keydown", key, true);
	}, [onClose, enabled]);
}
function Detail({ assets, item, onClose, completion = false, pending = false, owner }) {
	useEscape(onClose);
	const img = dialogImage(assets, item.image, 103, 103);
	const termDisabled = !completion && (item.disabled || item.level < item.maxLevel - 1);
	const done = !item.disabled && item.level === item.maxLevel - 1;
	const subtitle = completion ? tr(assets, "achievement:congratulation2") : !owner ? tr(assets, done ? "achievement:term:completed:host" : "achievement:info2") : item.disabled ? tr(assets, "achievement:term:locked", owner.male) : done ? tr(assets, "achievement:term:completed", owner.male) : tr(assets, "achievement:term:progress");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "achievement-detail-layer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": tr(assets, completion ? "dlg:kiss_bonus:title" : "dlg:achievement:info_title"),
			className: "popup popup--center",
			children: [
				!completion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					type: "button",
					className: "popup__close popup__close--dlg",
					"aria-label": "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "popup__header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__title",
						children: tr(assets, completion ? "dlg:kiss_bonus:title" : "dlg:achievement:info_title")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__content",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "achievement",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "achievement__subtitle",
								children: [owner && !completion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "achievement__username",
									children: owner.name
								}), subtitle]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "achievement-item achievement-item--big",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { item }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "achievement-item__icons",
									children: [completion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "achievement__background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										className: `achievement-item__image${item.disabled ? " achievement-item__image--disabled" : ""}`,
										src: img.src,
										width: img.width,
										height: img.height,
										alt: ""
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "achievement__name",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `achievement__term${termDisabled ? " achievement__term--disabled" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "achievement__term-icon" }), item.term]
							})
						]
					})
				}),
				completion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__buttons",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: pending,
						className: "achievement-continue",
						onClick: onClose,
						children: tr(assets, "dlg:achievement:btn_continue")
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__footer" })
			]
		})]
	});
}
/** Source AchievementsListDialog + AchievementPresenter.showList for the viewer. */
function SourceAchievementsDialog({ onClose, male = true, user }) {
	const assets = useCilizAssets();
	const own = useAchievementSession();
	const [other, setOther] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!user || !sb) return;
		let alive = true;
		let request = 0;
		let debounce;
		setOther([]);
		const load = async () => {
			const version = ++request;
			const { data, error } = await sb.rpc("user_achievements", { p_user: user.id });
			if (alive && version === request && !error) setOther((data ?? []).map((r) => ({
				achievement_id: r.achievement_id,
				level: r.level,
				acknowledged_at: null
			})));
		};
		load();
		const refresh = () => {
			clearTimeout(debounce);
			debounce = setTimeout(() => void load(), 120);
		};
		const channel = sb.channel(`other-achievements-${user.id}-${Math.random().toString(36).slice(2)}`).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "profiles",
			filter: `id=eq.${user.id}`
		}, refresh).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "gift_events"
		}, refresh).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "gesture_events"
		}, refresh).subscribe();
		const timer = window.setInterval(() => void load(), 1e4);
		return () => {
			alive = false;
			clearTimeout(debounce);
			window.clearInterval(timer);
			sb.removeChannel(channel);
		};
	}, [user?.id]);
	const session = user ? { completed: other } : own;
	if (user) male = user.male;
	const [tab, setTab] = (0, import_react.useState)("enabled");
	const [open, setOpen] = (0, import_react.useState)(null);
	const contentRef = (0, import_react.useRef)(null);
	const items = (0, import_react.useMemo)(() => assets ? buildItems(assets, male, session.completed) : [], [
		assets,
		male,
		session.completed
	]);
	const total = (0, import_react.useMemo)(() => items.reduce((acc, item) => acc + item.maxLevel, 0), [items]);
	const ordered = (0, import_react.useMemo)(() => {
		const done = items.filter((f) => !f.disabled && f.level === f.maxLevel - 1);
		const progress = items.filter((f) => !f.disabled && f.level < f.maxLevel - 1);
		const locked = items.filter((f) => f.disabled);
		return tab === "enabled" ? [
			...done,
			...progress,
			...locked
		] : [
			...locked,
			...progress,
			...done
		];
	}, [items, tab]);
	(0, import_react.useEffect)(() => {
		if (contentRef.current) contentRef.current.scrollTop = 0;
	}, [tab]);
	useEscape(onClose, !open);
	if (!assets) return null;
	const current = items.reduce((acc, a) => acc + (a.disabled ? 0 : Math.max(0, a.level) + 1), 0);
	const title = user ? tr(assets, "dlg:finished_achievements:other:title", user.name) : tr(assets, "dlg:finished_achievements:title");
	const portrait = typeof window === "undefined" || window.innerHeight >= window.innerWidth;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `achievements-layer ${portrait ? "portrait" : "landscape"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				role: "dialog",
				"aria-modal": !open,
				"aria-label": title,
				inert: Boolean(open),
				className: "popup popup--center achievements-list__x_popup",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "popup__close popup__close--dlg",
						"aria-label": "Bağla",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "popup__header achievements-list__x_popup__header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "popup__title achievements-list__x_popup__title",
							children: [
								title,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "achievements-list__title-star" }),
								current,
								"/",
								total
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "achievements-list__sort",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "achievements-list__tabs-title",
								children: tr(assets, "dlg:achievements:sort_title")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "achievements-list__tabs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "button",
									tabIndex: 0,
									className: `achievements-list__tab${tab === "enabled" ? " achievements-list__tab--active" : ""}`,
									onClick: () => setTab("enabled"),
									children: tr(assets, "dlg:achievements:completed")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "button",
									tabIndex: 0,
									className: `achievements-list__tab${tab === "disabled" ? " achievements-list__tab--active" : ""}`,
									onClick: () => setTab("disabled"),
									children: tr(assets, "dlg:achievements:locked")
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: contentRef,
						className: "popup__content popup__content--no-padding",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "achievements-list",
							children: ordered.map((item) => {
								const img = dialogImage(assets, item.image, 78, 78);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `achievements-list__item js-${item.id}`,
									title: item.name,
									onClick: () => setOpen(item),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "achievement-item",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { item }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "achievement-item__icons",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: `achievement-item__image achievement-item__image--medium${item.disabled ? " achievement-item__image--disabled" : ""}`,
												src: img.src,
												width: img.width,
												height: img.height,
												alt: item.name,
												loading: "lazy"
											})
										})]
									})
								}, item.id);
							})
						})
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
				assets,
				item: items.find((item) => item.id === open.id) ?? open,
				owner: user,
				onClose: () => setOpen(null)
			})
		]
	}), document.body);
}
/** Mounted at the table, so earned achievements appear even while the list is closed. */
function SourceAchievementNotifications({ male = true }) {
	const assets = useCilizAssets();
	const session = useAchievementSession();
	const [pending, setPending] = (0, import_react.useState)(false);
	const next = session.completed.find((row) => !row.acknowledged_at);
	if (!assets || !session.verified || !next) return null;
	const item = buildItems(assets, male, [next]).find((row) => row.id === next.achievement_id);
	if (!item) return null;
	const counter = item.asset.counters?.[next.level];
	item.term = tr(assets, `achievement:${item.id}:terms`, counter ?? "");
	const close = async () => {
		if (pending) return;
		setPending(true);
		try {
			await acknowledgeAchievement(next.achievement_id, next.level);
		} catch (e) {
			toast.error(gameError(e));
		} finally {
			setPending(false);
		}
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "achievements-layer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
			assets,
			item,
			completion: true,
			pending,
			onClose: () => {
				close();
			}
		})
	}), document.body);
}
var backgrounds = [
	"default",
	"#fff8ef",
	"#edf5e5",
	"#e8f0fa"
];
var fonts = [
	"inherit",
	"Arial, sans-serif",
	"Georgia, serif",
	"monospace"
];
var defaults = {
	background: "default",
	font: "inherit",
	premium: true,
	smileys: true
};
function parsePreferences(raw) {
	try {
		const p = JSON.parse(raw ?? "{}");
		return {
			background: backgrounds.includes(p?.background) ? p.background : defaults.background,
			font: fonts.includes(p?.font) ? p.font : defaults.font,
			premium: typeof p?.premium === "boolean" ? p.premium : true,
			smileys: typeof p?.smileys === "boolean" ? p.smileys : true
		};
	} catch {
		return { ...defaults };
	}
}
var key = "butl:chat-preferences";
var listeners$2 = /* @__PURE__ */ new Set();
var state$1 = defaults;
try {
	if (typeof localStorage !== "undefined") state$1 = parsePreferences(localStorage.getItem(key));
} catch {}
var getChatPreferences = () => state$1;
function setChatPreferences(patch) {
	state$1 = parsePreferences(JSON.stringify({
		...state$1,
		...patch
	}));
	try {
		localStorage.setItem(key, JSON.stringify(state$1));
	} catch {}
	listeners$2.forEach((fn) => fn());
}
if (typeof window !== "undefined") window.addEventListener("storage", (e) => {
	if (e.key === key || e.key === null) {
		state$1 = parsePreferences(e.newValue);
		listeners$2.forEach((fn) => fn());
	}
});
var useChatPreferences = () => (0, import_react.useSyncExternalStore)((fn) => {
	listeners$2.add(fn);
	return () => {
		listeners$2.delete(fn);
	};
}, getChatPreferences, () => defaults);
var empty = /* @__PURE__ */ new Set();
var blocked = empty;
var generation = 0;
var mutation = 0;
var mutationQueue = Promise.resolve();
var listeners$1 = /* @__PURE__ */ new Set();
var publish = (next) => {
	blocked = next;
	listeners$1.forEach((fn) => fn());
};
var sameBlocked = (a, b) => a.size === b.size && [...a].every((v) => b.has(v));
/** Owner-scoped ignore state shared by table, profiles and chat. */
function startCloudBlocks(viewerId) {
	const sb = getSupabase();
	const current = ++generation;
	let read = 0;
	publish(empty);
	if (!sb) return () => {};
	const load = async () => {
		const request = ++read;
		const revision = mutation;
		const { data, error } = await sb.from("user_blocks").select("blocked").eq("blocker", viewerId);
		if (error || current !== generation || request !== read || revision !== mutation) return;
		const next = new Set((data ?? []).map((row) => String(row.blocked)));
		if (!sameBlocked(next, blocked)) publish(next);
	};
	load();
	const channel = sb.channel(`ignore-${viewerId}-${current}`).on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "user_blocks"
	}, () => void load()).subscribe((status) => {
		if (status === "SUBSCRIBED") load();
	});
	const local = () => {
		read++;
		load();
	};
	window.addEventListener("source:ignore-changed", local);
	const timer = window.setInterval(() => void load(), 5e3);
	return () => {
		window.clearInterval(timer);
		window.removeEventListener("source:ignore-changed", local);
		sb.removeChannel(channel);
		if (generation === current) {
			generation++;
			publish(empty);
		}
	};
}
function useBlockedUsers() {
	return (0, import_react.useSyncExternalStore)((fn) => {
		listeners$1.add(fn);
		return () => {
			listeners$1.delete(fn);
		};
	}, () => blocked, () => empty);
}
function setUserBlocked(id, value) {
	const current = generation;
	const operation = mutationQueue.then(async () => {
		if (generation === current) await commitBlock(id, value, current);
	});
	mutationQueue = operation.catch(() => void 0);
	return operation;
}
async function commitBlock(id, value, current) {
	const sb = getSupabase();
	if (!sb) throw new Error("Oyunçu hesabına giriş edilməyib.");
	mutation++;
	const { error } = await sb.rpc("block_user", {
		p_user: id,
		p_block: value
	});
	if (error) throw error;
	if (generation !== current) return;
	mutation++;
	const next = new Set(blocked);
	if (value) next.add(id);
	else next.delete(id);
	publish(next);
	window.dispatchEvent(new Event("source:ignore-changed"));
}
function useGameSettings(viewerId, open) {
	const preferences = useChatPreferences();
	const blocked = useBlockedUsers();
	const [frozen, setFrozen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const [names, setNames] = (0, import_react.useState)({});
	const [child, setChild] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const fail = (e) => showSourceToast(gameError(e));
	(0, import_react.useEffect)(() => {
		let alive = true;
		setBusy(true);
		if (open && viewerId) getSupabase()?.from("profiles").select("freeze_kiss_ranking").eq("id", viewerId).single().then(({ data, error }) => {
			if (!alive) return;
			if (error) {
				fail(error);
				return;
			}
			setFrozen(Boolean(data?.freeze_kiss_ranking));
			setBusy(false);
		});
		return () => {
			alive = false;
		};
	}, [open, viewerId]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const ids = [...blocked];
		if (child === "blocks" && ids.length) getSupabase()?.from("profiles").select("id,name").in("id", ids).then(({ data, error }) => {
			if (!alive) return;
			if (error) fail(error);
			else setNames(Object.fromEntries((data ?? []).map((p) => [p.id, p.name])));
		});
		return () => {
			alive = false;
		};
	}, [blocked, child]);
	return {
		items: [
			{
				type: "simple",
				icon: "chatbg",
				name: "Çat fonu",
				action: () => setChild("background")
			},
			{
				type: "simple",
				icon: "chatfont",
				name: "Çat şrifti",
				action: () => setChild("font")
			},
			{
				type: "checkbox",
				icon: "premiumfx",
				name: "Premium hədiyyə effektləri",
				enabled: preferences.premium,
				onChange: (premium) => setChatPreferences({ premium })
			},
			{
				type: "checkbox",
				icon: "chatgestures",
				name: "Çatda smayliklər",
				enabled: preferences.smileys,
				onChange: (smileys) => setChatPreferences({ smileys })
			}
		],
		tail: [
			{
				type: "checkbox",
				icon: "kissfreeze",
				name: "Öpüş liderliyini dondur",
				enabled: frozen,
				busy,
				onChange: (value) => {
					const sb = getSupabase();
					if (!sb || !viewerId) return;
					setBusy(true);
					sb.rpc("set_kiss_ranking_frozen", { p_frozen: value }).then(({ error }) => {
						if (error) fail(error);
						else setFrozen(value);
						setBusy(false);
					});
				}
			},
			{
				type: "simple",
				icon: "blocklist",
				name: "Bloklanmış oyunçular",
				action: () => setChild("blocks")
			},
			{
				type: "link",
				icon: "admincontact",
				name: "Adminlə əlaqə",
				href: "https://t.me/cilizbot"
			},
			{
				type: "simple",
				icon: "exit",
				name: "Başqa cihazlardan çıx",
				action: () => {
					if (!window.confirm("Bu hesabla başqa telefon / kompüterdə girən hamı çıxarılsın? Siz burada qalırsınız.")) return;
					const sb = getSupabase();
					if (!sb) return;
					sb.auth.signOut({ scope: "others" }).then(({ error }) => {
						if (error) fail(error);
						else showSourceToast("Başqa cihazlardan çıxıldı");
					});
				}
			}
		],
		child,
		setChild,
		childTitle: child === "background" ? "Çat fonu" : child === "font" ? "Çat şrifti" : "Bloklanmış oyunçular",
		content: child === "blocks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [!blocked.size && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bloklanmış oyunçu yoxdur" }), [...blocked].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "settings__item",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: names[id] ?? id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				disabled: pending !== null,
				onClick: () => {
					setPending(id);
					setUserBlocked(id, false).catch(fail).finally(() => setPending(null));
				},
				children: "Blokdan çıxar"
			})]
		}, id))] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "settings",
			children: (child === "background" ? backgrounds : fonts).map((value, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "settings__item settings__item--selectable",
				"aria-pressed": (child === "background" ? preferences.background : preferences.font) === value,
				style: child === "background" ? { background: value === "default" ? void 0 : value } : { fontFamily: value },
				onClick: () => setChatPreferences(child === "background" ? { background: value } : { font: value }),
				children: [i === 0 ? "Standart" : child === "background" ? [
					"",
					"Krem",
					"Yaşıl",
					"Mavi"
				][i] : [
					"",
					"Arial",
					"Georgia",
					"Monospace"
				][i], (child === "background" ? preferences.background : preferences.font) === value ? " ✓" : ""]
			}, value))
		})
	};
}
function SourceFeaturePopup({ title, children, onClose, help, inactive = false, className = "", contentClass = "", footer, headerClass = "", titleClass = "", closeIconClass = "", manualClass }) {
	const ref = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(onClose);
	closeRef.current = onClose;
	(0, import_react.useEffect)(() => {
		if (inactive) return;
		const previous = document.activeElement;
		ref.current?.focus();
		const key = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopImmediatePropagation();
				closeRef.current();
			}
			if (e.key === "Tab") {
				const controls = ref.current?.querySelectorAll("button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]");
				if (!controls?.length) {
					e.preventDefault();
					return;
				}
				const first = controls[0], last = controls[controls.length - 1];
				if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
					e.preventDefault();
					last?.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
		};
		document.addEventListener("keydown", key, true);
		return () => {
			document.removeEventListener("keydown", key, true);
			if (previous instanceof HTMLElement) previous.focus();
		};
	}, [inactive]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-feature-layer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: (e) => {
				e.stopPropagation();
				if (!inactive) onClose();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			ref,
			tabIndex: -1,
			role: "dialog",
			"aria-modal": !inactive,
			inert: inactive,
			"aria-label": title,
			onClick: (e) => {
				if (className.includes("source-roulette-popup") && e.target === e.currentTarget && !inactive) {
					e.stopPropagation();
					onClose();
				}
			},
			className: `popup popup--center source-feature-popup ${className}`,
			children: [
				manualClass !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: `popup__header ${headerClass}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `popup__title ${titleClass}`,
							children: title
						}),
						help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "button",
							tabIndex: 0,
							"aria-label": "Kömək",
							className: manualClass,
							onClick: help,
							onKeyDown: (e) => {
								if (e.key === "Enter") help();
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "popup__close popup__close--dlg",
							"aria-label": "Bağla",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `popup__close-icon ${closeIconClass}` })
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "popup__close popup__close--dlg",
					"aria-label": "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "popup__header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__title",
						children: title
					}), help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "source-feature-help",
						"aria-label": "Kömək",
						onClick: help,
						children: "?"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `popup__content ${contentClass}`,
					children
				}),
				footer
			]
		})]
	});
}
function rich(text) {
	return text.split(/(<b>.*?<\/b>)/g).map((part, i) => {
		const b = /^<b>(.*?)<\/b>$/.exec(part);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: b ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: b[1] }) : part.replace(/<[^>]*>/g, "") }, i);
	});
}
function dateBound(age) {
	const d = /* @__PURE__ */ new Date();
	d.setFullYear(d.getFullYear() - age);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function ProfileInfoDialog({ assets, onClose }) {
	const profile = useSourceFeatureSession().profile;
	const [birthday, setBirthday] = (0, import_react.useState)(profile?.birthday ?? "");
	const [male, setMale] = (0, import_react.useState)(profile?.male ?? true);
	const [photo, setPhoto] = (0, import_react.useState)(profile?.photo ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	const initialized = (0, import_react.useRef)(false), fileRef = (0, import_react.useRef)(null);
	const t = (key) => translate(assets, key);
	(0, import_react.useEffect)(() => {
		let active = true;
		executeSourceFeature("profile-refresh").then((r) => {
			if (active && !r.confirmed) setMessage((r.message ? gameError(r.message) : void 0) ?? t("dlg:music:unavailable"));
		}).catch((e) => {
			if (active) setMessage(gameError(e));
		});
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (profile && !initialized.current) {
			initialized.current = true;
			setBirthday(profile.birthday);
			setMale(profile.male);
			setPhoto(profile.photo ?? "");
		}
	}, [profile]);
	const infoChanged = !!profile && (birthday !== profile.birthday || male !== profile.male);
	const photoChanged = !!profile && photo !== (profile.photo ?? "");
	const save = async () => {
		if (!profile || busy) return;
		setBusy(true);
		setMessage("");
		try {
			if (photoChanged) {
				const r = await executeSourceFeature("save-profile-photo", { photo });
				if (!r.confirmed) throw new Error(r.message ?? "Şəkil yadda saxlanılmadı.");
			}
			if (infoChanged) {
				const r = await executeSourceFeature("save-profile", {
					birthday,
					male: male ? 1 : 0,
					expectedPrice: profile.changePrice ?? -1,
					expectedBirthday: profile.birthday,
					expectedMale: profile.male ? 1 : 0
				});
				if (!r.confirmed) throw new Error(r.message ?? "Profil yadda saxlanılmadı.");
			}
			onClose();
		} catch (e) {
			setMessage(gameError(e));
		} finally {
			setBusy(false);
		}
	};
	const footer = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "popup__buttons",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			className: "button button--cancel",
			disabled: busy,
			onClick: onClose,
			children: t("dlg:profile_info:cancel")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			className: "button button--confirm",
			disabled: busy || !profile || !infoChanged && !photoChanged || infoChanged && (!birthday || birthday < dateBound(98) || birthday > dateBound(18) || profile.changePrice === void 0),
			onClick: () => void save(),
			children: t("dlg:profile_info:save")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
		title: t("dlg:profile_info:title"),
		onClose: busy ? () => {} : onClose,
		className: "profile-info__x_popup source-profile-info-popup popup--show",
		contentClass: "profile-info__x_popup__content",
		manualClass: "",
		footer,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "profile-info",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "profile-info__profile",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "profile-info__photo",
							"aria-label": t("dlg:profile_info:photo"),
							disabled: busy || !profile,
							onClick: () => fileRef.current?.click(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: photo || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K",
								alt: ""
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: `profile-info__add-photo profile-info__add-photo--${photo ? "reset" : "add"}`,
							"aria-label": t(photo ? "dlg:profile_info:reset_photo" : "dlg:profile_info:photo"),
							disabled: busy || !profile,
							onClick: () => photo ? setPhoto("") : fileRef.current?.click()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "profile-info__photo-input",
							onChange: async (e) => {
								const file = e.target.files?.[0];
								e.target.value = "";
								if (!file) return;
								setBusy(true);
								try {
									setPhoto(await prepareProfilePhoto(file));
								} catch (e) {
									setMessage(gameError(e));
								} finally {
									setBusy(false);
								}
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "profile-info__add-photo-title",
							children: t(photo ? "dlg:profile_info:reset_photo" : "dlg:profile_info:photo")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "profile-info__info",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "profile-info__name",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "profile-info__info-title",
								children: [t("dlg:profile_info:name"), ":"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": t("dlg:profile_info:name"),
								value: profile?.name ?? "",
								maxLength: 50,
								readOnly: true,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "profile-info__date",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "profile-info__info-title",
								children: [t("dlg:profile_info:date"), ":"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": t("dlg:profile_info:date"),
								type: "date",
								value: birthday,
								min: dateBound(98),
								max: dateBound(18),
								disabled: busy || !profile,
								required: true,
								onChange: (e) => {
									const v = e.target.value;
									setBirthday(v ? v < dateBound(98) ? dateBound(98) : v > dateBound(18) ? dateBound(18) : v : "");
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "profile-info__gender",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "profile-info__info-title",
								children: [t("dlg:profile_info:gender"), ":"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "profile-info__gender-items",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									"aria-label": "Kişi",
									"aria-pressed": male,
									disabled: busy || !profile,
									className: `profile-info__gender-item profile-info__gender-item--male${male ? "" : " profile-info__gender-item--inactive"}`,
									onClick: () => setMale(true)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									"aria-label": "Qadın",
									"aria-pressed": !male,
									disabled: busy || !profile,
									className: `profile-info__gender-item profile-info__gender-item--female${male ? " profile-info__gender-item--inactive" : ""}`,
									onClick: () => setMale(false)
								})]
							})]
						})
					]
				})]
			}),
			infoChanged && profile?.changePrice !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "profile-info__description",
				children: [rich(t(profile.changePrice === 0 ? "dlg:profile_info:warning:tg" : "dlg:profile_info:description")), profile.changePrice > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "profile-info__heart",
					children: profile.changePrice
				})]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				role: "status",
				children: message
			})
		]
	});
}
function SourceSettingsChild({ kind, assets, onClose }) {
	const session = useSourceFeatureSession();
	const [message, setMessage] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [inviteUrl, setInviteUrl] = (0, import_react.useState)("");
	const t = (key) => translate(assets, key);
	const act = async (action) => {
		if (busy) return;
		setBusy(true);
		try {
			const r = await executeSourceFeature(action);
			if (r.inviteUrl) setInviteUrl(r.inviteUrl);
			else if (r.confirmed) onClose();
			else setMessage((r.message ? gameError(r.message) : void 0) ?? t("dlg:music:unavailable"));
		} catch (e) {
			setMessage(gameError(e));
		} finally {
			setBusy(false);
		}
	};
	const title = kind === "invite" ? t("dlg:invite_friend:title") : kind === "profile" ? t("dlg:profile_info:title") : t("dlg:settings:contacts");
	if (kind === "profile") return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileInfoDialog, {
		assets,
		onClose
	}), document.body);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
		title,
		onClose,
		children: [kind === "invite" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "invite-friend",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "source-feature-message",
					children: t("dlg:invite_friend_teaser:text:v2").replace("<gold/>", "— ♥")
				}),
				inviteUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					readOnly: true,
					"aria-label": "Dəvət keçidi",
					value: inviteUrl
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "popup__buttons",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "button--confirm",
						disabled: busy || !session.viewerId,
						onClick: () => void act("invite"),
						children: t("dlg:invite_friend:invite")
					}), inviteUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: async () => {
							try {
								await navigator.clipboard.writeText(inviteUrl);
								setMessage(t("dlg:invite_friend_qr:toast"));
							} catch {
								setMessage(t("dlg:invite_friend_qr:toast2"));
							}
						},
						children: t("dlg:invite_friend_qr:btn_copy")
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "settings",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "settings__item settings__item--selectable",
				href: t("dlg:settings:contacts:href"),
				target: "_blank",
				rel: "noopener noreferrer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "settings__icon settings__icon--faq" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "settings__item-name",
					children: t("dlg:settings:faq")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				className: "settings__item settings__item--selectable",
				disabled: !session.viewerId || busy,
				onClick: () => void act("feedback"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "settings__icon settings__icon--report" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "settings__item-name",
					children: t("dlg:settings:console_report:menu")
				})]
			})]
		}), message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "source-feature-message",
			role: "status",
			children: message
		})]
	}), document.body);
}
var TG_SUPPORT_EMAIL = "support@cyboma.gg";
var TG_LEGAL = {
	privacyUrl: "https://butilochka.cdnvideo.ru/bottle/bundle/legal/bottle_privacy.html",
	termsUrl: "https://butilochka.cdnvideo.ru/bottle/bundle/legal/bottle_terms.html"
};
var CLIENT_VERSION = "1.6.393";
function buildSettingsItems(t, cb) {
	return [
		{
			type: "slider",
			icon: "sound",
			name: t("ios:dlg:settings:sounds"),
			onChange: cb.onSfx
		},
		{
			type: "slider",
			icon: "music",
			name: t("ios:dlg:settings:music"),
			onChange: cb.onMusic
		},
		{
			type: "simple",
			icon: "invite",
			name: t("bank:invite:btn"),
			action: cb.onInvite
		},
		{
			type: "simple",
			icon: "profile-info",
			name: t("dlg:profile_info:title"),
			action: cb.onProfile
		},
		{
			type: "simple",
			icon: "feedback",
			name: t("dlg:settings:contacts"),
			action: cb.onContacts
		}
	];
}
var qs$1 = (o) => new URLSearchParams(o).toString();
function buildContactItems(t, p) {
	const id = p.viewerId ?? "";
	return [
		{
			type: "link",
			icon: "email",
			name: t("dlg:settings:email"),
			href: `mailto:${TG_SUPPORT_EMAIL}?${qs$1({ subject: [
				`Platform: ${p.platform}`,
				`social: ${p.social}`,
				`id: ${id}`
			].join(", ") })}`
		},
		{
			type: "link",
			icon: "telegram",
			name: t("dlg:settings:telegram"),
			href: `https://t.me/cilizbot?${qs$1({ start: [
				p.platform,
				p.social,
				id
			].join("_") })}`
		},
		{
			type: "link",
			icon: "faq",
			name: t("dlg:settings:faq"),
			href: t("dlg:settings:contacts:href")
		},
		{
			type: "link",
			icon: "privacy",
			name: t("dlg:settings:pp"),
			href: TG_LEGAL.privacyUrl
		},
		{
			type: "link",
			icon: "terms",
			name: t("dlg:settings:tos"),
			href: TG_LEGAL.termsUrl
		},
		{
			type: "simple",
			icon: "report",
			name: t("dlg:settings:console_report:menu"),
			action: p.onReport
		}
	];
}
function idCopyValue(platform, social, viewerId) {
	return [
		platform,
		social,
		CLIENT_VERSION,
		viewerId
	].filter(Boolean).join(":");
}
var bem$5 = (block) => (element = "", mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
var cls$5 = bem$5("settings");
var popup$2 = bem$5("popup");
function usePopupPhase$1(open) {
	const [mounted, setMounted] = (0, import_react.useState)(open);
	const [phase, setPhase] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setMounted(true);
			setPhase("show");
			const id = window.setTimeout(() => setPhase(null), 300);
			return () => window.clearTimeout(id);
		}
		if (!mounted) return;
		setPhase("hide");
		const id = window.setTimeout(() => {
			setMounted(false);
			setPhase(null);
		}, 100);
		return () => window.clearTimeout(id);
	}, [open]);
	return {
		mounted,
		phase
	};
}
function Slider({ icon, name, value, onChange }) {
	const percent = value * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls$5("checkbox-item"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$5("checkbox-title"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$5("icon", [icon]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cls$5("item-name"),
				children: name
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: cls$5("slider"),
			type: "range",
			min: 0,
			max: 1,
			step: .01,
			value,
			"aria-label": name,
			onChange: (e) => onChange(Number(e.target.value)),
			style: { background: `linear-gradient(to right, var(--source-tops-confirm) ${percent}%, var(--game-menu-pressed) ${percent}%)` }
		})]
	});
}
/** SettingsDialog_Items "simple" and "link" (window opener): the dialog closes, then the action runs. */
function Simple({ item, close }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [item.border === "top" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$5("border") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		className: cls$5("item", ["selectable"]),
		onClick: () => {
			close();
			if (item.type === "link") window.open(item.href, "_blank", "noopener");
			else item.action();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$5("icon", [item.icon]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cls$5("item-name"),
			children: item.name
		})]
	})] });
}
function SettingsPopup({ title, items, phase, onClose, info, sliders, children }) {
	(0, import_react.useEffect)(() => {
		const key = (e) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [onClose]);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "source-settings-layer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": true,
				"aria-label": title,
				className: [
					"popup",
					"popup--center",
					phase === "show" && "popup--show",
					phase === "hide" && "popup--hide"
				].filter(Boolean).join(" "),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: popup$2("header"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: popup$2("title"),
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: popup$2("close", ["dlg"]),
						"aria-label": "Bağla",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: popup$2("close-icon") })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `${popup$2("content", ["center"])} ${cls$5("x_popup__content")}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cls$5(""),
						children: [
							children,
							items.map((item) => item.type === "slider" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								icon: item.icon,
								name: item.name,
								value: item.icon === "sound" ? sliders?.sfx ?? 0 : sliders?.music ?? 0,
								onChange: item.onChange
							}, item.icon) : item.type === "checkbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cls$5("checkbox-item"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cls$5("checkbox-title"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$5("icon", [item.icon]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cls$5("item-name"),
										children: item.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "checkbox settings__x_checkbox",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "checkbox__input",
										type: "checkbox",
										"aria-label": item.name,
										checked: item.enabled,
										disabled: item.busy,
										onChange: (e) => item.onChange(e.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "checkbox__label" })]
								})]
							}, item.icon) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Simple, {
								item,
								close: onClose
							}, item.icon + item.name)),
							info && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cls$5("info"),
								style: {
									position: "relative",
									cursor: "pointer"
								},
								onClick: info.onCopy,
								children: [info.icons.filter(Boolean).map((icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$5("icon", [icon]) }, icon)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cls$5("id"),
									children: info.id
								})]
							})
						]
					})
				})]
			})]
		})
	}), document.body);
}
function SettingsDialog({ open, onClose }) {
	const session = useSourceFeatureSession();
	const game = useGameSettings(session.viewerId, open);
	const [view, setView] = (0, import_react.useState)(null);
	const [assets, setAssets] = (0, import_react.useState)(null);
	const { mounted, phase } = usePopupPhase$1(open);
	const sfxVolume = useSfxVolume();
	const music = useMusicSession();
	(0, import_react.useEffect)(() => {
		if (open) setView("settings");
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (open && !assets) loadCilizAssets().then(setAssets).catch(() => void 0);
	}, [open, assets]);
	if (game.child) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPopup, {
		title: game.childTitle,
		items: [],
		phase: "show",
		onClose: () => {
			game.setChild(null);
			setView(null);
			onClose();
		},
		children: game.content
	});
	if (!assets || !mounted && view === "settings" || !view) return null;
	const t = (key) => translate(assets, key);
	const platform = "html5";
	const social = VIEWER_STORE.social;
	const viewerId = session.viewerId ?? void 0;
	const finish = () => {
		setView(null);
		onClose();
	};
	if (view === "contacts") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPopup, {
		title: t("dlg:settings:contacts"),
		phase: "show",
		onClose: finish,
		items: buildContactItems(t, {
			social,
			platform,
			viewerId,
			onReport: () => setView("report")
		})
	});
	if (view === "profile") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceSettingsChild, {
		kind: "profile",
		assets,
		onClose: finish
	});
	if (view === "report") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceInfoDialog, {
		title: t("dlg:settings:console_report:title"),
		context: t("dlg:settings:console_report:context"),
		onClose: finish,
		cancel: {
			title: t("dlg:report_issue:cancel"),
			onClick: finish
		},
		confirm: {
			title: t("android:dlg:feedback:send"),
			onClick: () => {
				finish();
				executeSourceFeature("feedback").then((r) => showSourceToast(r.confirmed ? t("dlg:settings:console_report:sent") : r.message ?? t("dlg:music:unavailable"))).catch((e) => showSourceToast(gameError(e)));
			}
		}
	});
	const items = buildSettingsItems(t, {
		onSfx: setSfxVolume,
		onMusic: setMusicVolume,
		onInvite: () => {
			executeSourceFeature("invite").then((r) => {
				const url = r.inviteUrl ?? window.location.origin;
				const share = `https://t.me/share/url?${new URLSearchParams({
					url,
					text: t("dlg:tg:share:text:ab_20240708:c:v2")
				})}`;
				const tg = window.Telegram?.WebApp;
				if (tg?.openTelegramLink) tg.openTelegramLink(share);
				else window.open(share, "_blank", "noopener");
			}).catch(() => showSourceToast(t("dlg:settings:nofriends_toast")));
		},
		onProfile: () => setView("profile"),
		onContacts: () => setView("contacts")
	});
	items.splice(2, 0, ...game.items);
	items.push(...game.tail);
	const copyId = async () => {
		const value = idCopyValue(platform, social, viewerId);
		try {
			await navigator.clipboard.writeText(value);
			showSourceToast(t("dlg:settings:id_toast"));
		} catch {
			showSourceToast(value);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPopup, {
		title: t("ios:dlg:settings:title"),
		phase,
		onClose: finish,
		items,
		sliders: {
			sfx: sfxVolume,
			music: music.muted ? 0 : music.volume
		},
		info: {
			icons: [platform],
			id: viewerId ?? "",
			onCopy: copyId
		}
	});
}
function Img({ assets, name, size }) {
	if (!assets.images[name]) return null;
	const image = dialogImage(assets, name, size, size);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: image.src,
		width: size,
		height: size,
		alt: ""
	});
}
/** Port of LeagueDialog.tsx: info header, then up / stay / down sections with labels. */
function SourceLeagueBody({ assets, league, viewerId, onLadder, onPrize, onLimit, onClaim, onHeaderState }) {
	const root = (0, import_react.useRef)(null), upRef = (0, import_react.useRef)(null), stayRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const div = root.current?.closest(".popup__content");
		if (!div || !onHeaderState) return;
		const scroll = () => {
			const up = upRef.current, stay = stayRef.current;
			if (!up || !stay) return;
			onHeaderState(div.scrollTop < up.clientHeight + 1 ? "up" : div.scrollTop > up.clientHeight + stay.clientHeight ? "down" : "stay");
		};
		div.addEventListener("scroll", scroll);
		scroll();
		return () => div.removeEventListener("scroll", scroll);
	}, [onHeaderState]);
	const t = (key, ...args) => translate(assets, key, ...args);
	const finished = league.state === "finished";
	const usersMax = league.usersMax ?? 20, moveUp = league.moveUp ?? 3, moveDown = league.moveDown ?? 3;
	const rows = league.players.map((p, i) => ({
		...p,
		pos: i + 1
	}));
	const parts = splitLeague(rows, moveUp, moveDown, usersMax);
	const entry = assets.leagues?.[league.level];
	const limit = !finished && league.limit ? "limited" : void 0;
	const user = (u) => {
		const viewer = u.id === viewerId;
		const present = u.pos <= moveUp && u.pos < 4 ? String(u.pos) : "regular";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "league__user",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "league__photo",
				style: {
					backgroundImage: `url(${u.photo || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"})`,
					backgroundSize: "cover",
					backgroundPosition: "center top"
				},
				onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: u.id }))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `league__user-info${viewer ? " league__user-info--viewer" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "league__name",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "league__position",
						children: [u.pos, "."]
					}), u.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "league__stats",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "league__stars",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `league__stars-icon${viewer && limit ? " league__stars-icon--enabled" : ""}`,
							onClick: viewer && limit ? onLimit : void 0,
							children: viewer && limit ? "!" : ""
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "league__stars-count",
							children: u.score
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `league__present league__present--${present}`,
						onClick: () => onPrize(u.pos),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `league__present-icon league__present-icon--${present}` })
					})]
				})]
			})]
		}, u.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "league",
		ref: root,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "league__section league__section--up",
				ref: upRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league__header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "league__info",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `league__info-title${finished ? " league__info-title--no-boosters" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "league__description",
								children: finished ? t("dlg:league_finish:desc") : t("dlg:league:desc:boosters")
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: `league__cup-bg league__cup-bg--${finished ? "finish" : "altar"}${finished ? "" : " league__cup-bg--enabled"}`,
							"aria-label": t("dlg:league:ladder:title"),
							onClick: finished ? void 0 : onLadder,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
								assets,
								name: entry?.image ?? "",
								size: 84
							}), !finished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "league__ladder-icon" })]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league__list",
					children: parts.up.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [parts.up.map(user), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "league__label league__label--move",
						children: t("dlg:league:desc:up")
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "league__section",
				ref: stayRef,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league__list",
					children: parts.stay.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "league__label league__label--stay",
							children: t("dlg:league:desc:stay")
						}),
						parts.stay.map(user),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "league__label league__label--stay",
							children: t("dlg:league:desc:stay")
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "league__section league__section--down",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league__list",
					children: parts.down.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "league__label league__label--move",
						children: t("dlg:league:desc:down")
					}), parts.down.map(user)] })
				})
			}),
			finished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinishedRewards, {
				assets,
				league,
				onClaim
			})
		]
	});
}
/** Original RewardDialog: closed chest first (btn_open), then the opened prize view (btn_claim). */
function FinishedRewards({ assets, league, onClaim }) {
	const [opened, setOpened] = (0, import_react.useState)(false);
	const t = (key, ...args) => translate(assets, key, ...args);
	const pos = league.finalPos ?? 0;
	const chest = pos >= 1 && pos <= 3 ? String(pos) : "regular";
	if (!opened) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "popup__buttons",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				children: t("dlg:league_reward:desc")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `league__present league__present--${chest} league__present--chest`,
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `league__present-icon league__present-icon--${chest}` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "button button--confirm",
				onClick: () => setOpened(true),
				children: t("dlg:league_reward:btn_open")
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "popup__buttons",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				children: t("dlg:league:desc:prize_finish", String(league.finalPos ?? "—"))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "source-feature-rewards",
				children: [(league.rewardGifts ?? []).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
					assets,
					name: assets.gifts[id]?.storeImage ?? "",
					size: 60
				}, id)), league.rewardGold ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "source-feature-reward",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "roulette__heart"
					}), league.rewardGold]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "button button--confirm",
				onClick: onClaim,
				children: t("dlg:league_reward:btn_claim")
			})
		]
	});
}
var sourceRouletteReferenceArtwork = [
	["chances", 3],
	["tokens", 100],
	["kiss_fire", 3],
	["gold", 10],
	["tokens", 5],
	["league5", 1],
	["gold", 3],
	["chances", 1],
	["tokens", 1e3],
	["kiss_fire", 3],
	["gold", 25],
	["tokens", 3],
	["league_kiss2x", 1],
	["gold", 5],
	["tokens", 25],
	["refuse_slap", 1]
].map(([image, count], index) => ({
	id: `reference-${index}`,
	image: String(image),
	count: Number(count)
}));
/** Public reference labels never authorize a spin or define a server payout. */
function SourceRouletteWheel({ assets, prizes, wheelRef }) {
	const sectors = prizes.length ? prizes : sourceRouletteReferenceArtwork;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "roulette__wheel-section",
		"data-reference-artwork": !prizes.length,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "roulette__wheel-overflow-container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: wheelRef,
					className: "roulette__wheel",
					children: sectors.map((reward, index) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-text": reward.count,
							className: `roulette__wheel-item roulette__wheel-item--${reward.image}`,
							style: { transform: `translate(0%, -50%) rotate(${index * 360 / sectors.length}deg) translate(105px) rotate(180deg)` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: `roulette__reward-icon roulette__reward-icon--${reward.image}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: reward.count })]
						}, reward.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "roulette__wheel-frame",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "roulette__wheel-center",
				"aria-hidden": true
			})
		]
	});
}
/** Source RouletteItem/Heart animation: 30fps, 114-frame timeline, tap-to-skip. */
function RouletteRewardAnimation({ reward, template, onFinish }) {
	const finish = (0, import_react.useRef)(onFinish);
	finish.current = onFinish;
	(0, import_react.useEffect)(() => {
		const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		const sound = window.setTimeout(() => void playSfx(template, "roulette_reward"), reduced ? 0 : 5 / 30 * 1e3);
		const end = window.setTimeout(() => finish.current(), reduced ? 500 : 3800);
		const key = (event) => {
			if (event.key === "Escape") {
				event.stopImmediatePropagation();
				finish.current();
			}
		};
		document.addEventListener("keydown", key, true);
		return () => {
			clearTimeout(sound);
			clearTimeout(end);
			document.removeEventListener("keydown", key, true);
		};
	}, [reward.id, template]);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "roulette-earned",
		role: "dialog",
		"aria-label": "Çarx mükafatı",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			className: "roulette-earned__surface",
			"aria-label": "Mükafatı bağla",
			onClick: () => finish.current(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "roulette-earned__stars",
					"aria-hidden": true,
					children: Array.from({ length: 16 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `roulette-earned__star roulette-earned__star--${i}`,
						children: "✦"
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `roulette__reward-icon roulette__reward-icon--${reward.image} roulette-earned__icon`,
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "roulette-earned__amount",
					children: reward.count
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "roulette-earned__name",
					children: roulettePrizeNames[reward.image] ?? reward.image
				})
			]
		})
	}), document.body);
}
function Text({ text }) {
	let bold = false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text.split(/(<b>|<\/b>|<[^>]+>)/g).map((part, i) => {
		if (part === "<b>" || part === "</b>") {
			bold = part === "<b>";
			return null;
		}
		if (part.startsWith("<")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": true,
			className: part.includes("star") ? "bottle-pass__star" : part.includes("chance") ? "roulette__spins-price" : "roulette__heart"
		}, i);
		return bold ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: part }, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	}) });
}
function Image$2({ assets, name, size = 60 }) {
	if (!assets.images[name]) return null;
	const image = dialogImage(assets, name, size, size);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: image.src,
		width: image.width,
		height: image.height,
		alt: ""
	});
}
function Rewards({ assets, rewards }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "source-feature-rewards",
		children: rewards.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "source-feature-reward",
			children: [assets.images[r.image] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
				assets,
				name: r.image
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: `roulette__reward-icon roulette__reward-icon--${r.image}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.title ? `${r.title} ` : "", r.count] })]
		}, r.id))
	});
}
/** secondsToShortText from the original client. */
function shortText(sec, t) {
	const d = Math.floor(sec / 86400), h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60;
	return d ? `${d}\u00A0${t("dlg:top:timer:days")}` : h ? `${h}\u00A0${t("dlg:top:timer:hours")}` : m ? `${m}\u00A0${t("dlg:top:timer:minutes")}` : `${sec % 60}\u00A0${t("dlg:top:timer:seconds")}`;
}
/** Public presentation; schedules, prize tables and every transaction remain host-owned. */
function SourceSeasonDialog({ feature, onClose, onSettings }) {
	const assets = useCilizAssets(), session = useSourceFeatureSession();
	const [nested, setNested] = (0, import_react.useState)(null), [leagueResult, setLeagueResult] = (0, import_react.useState)(null), [selectedLeague, setSelectedLeague] = (0, import_react.useState)(null), [rewards, setRewards] = (0, import_react.useState)([]), [message, setMessage] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [spinning, setSpinning] = (0, import_react.useState)(false), [now, setNow] = (0, import_react.useState)(Date.now());
	const [leagueHeaderState, setLeagueHeaderState] = (0, import_react.useState)("up"), onLeagueHeader = (0, import_react.useCallback)((v) => setLeagueHeaderState(v), []);
	const wheel = (0, import_react.useRef)(null), rotation = (0, import_react.useRef)(0), timeout = (0, import_react.useRef)(void 0), spinGeneration = (0, import_react.useRef)(0), pendingRewards = (0, import_react.useRef)([]), seenRewards = (0, import_react.useRef)(/* @__PURE__ */ new Set()), inFlight = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (feature === "league") executeSourceFeature("league-refresh").catch(() => void 0);
	}, [feature]);
	(0, import_react.useEffect)(() => {
		if (feature === "roulette") executeSourceFeature("roulette-refresh").catch((e) => setMessage(gameError(e)));
	}, [feature]);
	(0, import_react.useEffect)(() => {
		if (feature === "roulette" && assets) {
			preloadSfx(assets.sfxUrl, "roulette_spin");
			preloadSfx(assets.sfxUrl, "roulette_reward");
		}
	}, [feature, assets]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => {
			window.clearInterval(id);
			window.clearTimeout(timeout.current);
			spinGeneration.current++;
		};
	}, []);
	if (!assets) return null;
	const t = (key, ...args) => translate(assets, key, ...args);
	const title = feature === "roulette" ? t("roulette:main:panel1:header") : feature === "bottle-pass" ? t("dlg:bottle_pass:title") : session.league ? t(`dlg:league:${session.league.level}`) : session.leagueState === "welcome" ? t(`dlg:league:${session.leagueLevel ?? 0}`) : t("dlg:league:idle:title");
	const showEarned = (items) => {
		const verified = items.filter((r) => r.id && Number.isSafeInteger(r.count) && r.count > 0 && !seenRewards.current.has(r.id));
		if (!verified.length) return;
		verified.forEach((r) => seenRewards.current.add(r.id));
		setRewards(verified);
		setNested("reward");
	};
	const finishSpin = () => {
		window.clearTimeout(timeout.current);
		spinGeneration.current++;
		if (wheel.current) {
			wheel.current.style.transition = "none";
			wheel.current.style.transform = `rotate(${rotation.current}deg)`;
		}
		setSpinning(false);
		showEarned(pendingRewards.current);
		pendingRewards.current = [];
	};
	const act = async (action, input) => {
		if (inFlight.current || spinning) return;
		inFlight.current = true;
		setBusy(true);
		setMessage("");
		try {
			const result = await executeSourceFeature(action, action === "roulette-spin" || action === "roulette-buy-chances" ? {
				...input,
				requestId: crypto.randomUUID()
			} : input);
			if (!result.confirmed) {
				setMessage(result.message ?? t("dlg:music:unavailable"));
				return;
			}
			if (action === "roulette-spin") {
				const count = session.roulette?.prizes.length ?? 16, idx = result.rewardIndex;
				if (idx === void 0 || !Number.isInteger(idx) || idx < 0 || idx >= count) {
					setMessage(t("dlg:music:unavailable"));
					return;
				}
				pendingRewards.current = result.rewards ?? [];
				setSpinning(true);
				playSfx(assets.sfxUrl, "roulette_spin");
				const generation = ++spinGeneration.current;
				let delta = ((180 - idx * (360 / count) + 360) % 360 - rotation.current % 360 + 360) % 360;
				if (delta <= 0) delta += 360;
				rotation.current += Math.ceil(3 + Math.random() * 2) * 360 + delta;
				const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
				if (wheel.current) {
					wheel.current.style.transition = reduced ? "none" : "transform 4s cubic-bezier(0.17,0.67,0.12,0.99)";
					wheel.current.style.transform = `rotate(${rotation.current}deg)`;
				}
				timeout.current = window.setTimeout(() => {
					if (generation === spinGeneration.current) finishSpin();
				}, reduced ? 0 : 4e3);
			} else {
				if (action === "roulette-buy-chances") setNested(null);
				showEarned(result.rewards ?? []);
			}
		} catch (e) {
			setMessage(gameError(e));
		} finally {
			inFlight.current = false;
			setBusy(false);
		}
	};
	const remaining = (endsAt) => endsAt === void 0 ? "—" : `${Math.floor(Math.max(0, endsAt - now) / 36e5)}:${Math.floor(Math.max(0, endsAt - now) / 6e4) % 60}`;
	const info = (index) => {
		setSelectedLeague(index);
		setNested("reward-info");
	};
	let body;
	if (feature === "league") {
		const level = session.league?.level;
		level === void 0 || assets.leagues?.[level];
		const cup = assets.leagues?.[session.leagueLevel ?? 0]?.image ?? assets.leagues?.[0]?.image ?? "";
		body = !session.league ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "league-move",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "league-move__cups",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
					assets,
					name: cup,
					size: 118
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "league-move__description",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: session.leagueState === "loading" ? "…" : session.leagueState === "welcome" ? t("dlg:league:welcome:desc") : session.leagueState === "idle" ? t(`dlg:league:${session.leagueLevel ?? 0}`) : session.leagueState === "error" ? "Liqa məlumatları serverdən alınmadı. Daha sonra yenidən cəhd edin." : t("dlg:league:undefined") })
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceLeagueBody, {
			assets,
			league: session.league,
			viewerId: session.viewerId,
			onLadder: () => setNested("ladder"),
			onPrize: () => info(level ?? 0),
			onLimit: () => setNested("limit"),
			onClaim: () => {
				const id = session.league?.roundId;
				if (id === void 0) {
					onClose();
					return;
				}
				const pos = session.league?.finalPos ?? 0, up = session.league?.moveUp ?? 3, max = session.league?.usersMax ?? 20, down = session.league?.moveDown ?? 3;
				setLeagueResult(pos >= 1 && pos <= up ? "up" : pos > max - down ? "down" : "stay");
				act("league-seen", { roundId: id }).then(() => setNested("result"));
			},
			onHeaderState: onLeagueHeader
		});
	} else if (feature === "roulette") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "roulette roulette__x_popup__content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "roulette__paper roulette__paper--guide",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "roulette__help-icon",
						"aria-label": "Kömək",
						onClick: () => setNested("help")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "roulette__title",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "roulette__description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t("roulette:main:panel1:desc") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "roulette__chances",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("roulette:main:panel1:chances") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "roulette__chances-stats",
							"aria-label": t("roulette:main:panel1:chances"),
							onClick: () => setNested("chances"),
							children: [session.roulette?.freeSpins ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "roulette__chances-plus",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "roulette__chances-plus-icon" })
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "roulette__paper roulette__paper--wheel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceRouletteWheel, {
						assets,
						prizes: session.roulette?.prizes ?? [],
						wheelRef: wheel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "roulette__spins",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t("roulette:main:price") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: session.roulette?.price ?? 1 })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__buttons",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "button--confirm roulette__x_button",
							disabled: busy || !spinning && (!session.viewerId || !session.roulette || session.roulette.enabled === false || session.roulette.freeSpins < session.roulette.price),
							onClick: () => spinning ? finishSpin() : void act("roulette-spin"),
							children: t(spinning ? "roulette:main:btn2" : "roulette:main:btn1")
						})
					}),
					session.roulette?.enabled === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "source-feature-message",
						children: "Çarx hazırda bağlıdır."
					})
				]
			}),
			session.roulette?.winner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "roulette__paper roulette__paper--jackpot",
				children: [session.roulette.winner.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "roulette__photo",
					src: session.roulette.winner.photo,
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "roulette__jackpot-info",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "roulette__jackpot-title",
						children: t("roulette:main:panel2:header2")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "roulette__message",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "roulette__name",
								children: session.roulette.winner.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t("roulette:main:panel2:desc2") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: session.roulette.winner.amount })
						]
					})]
				})]
			})
		]
	});
	else body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bottle-pass",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bottle-pass__season-stats",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bottle-pass__season-timer",
						children: t("dlg:bottle_pass:timer").replace("%", remaining(session.pass?.endsAt))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bottle-pass__star" }),
					session.pass?.points ?? "—"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bottle-pass__header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setNested("premium"),
						children: t("dlg:bottle_pass:premium_rewards")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("dlg:bottle_pass:level") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("dlg:bottle_pass:free_rewards") })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bottle-pass__levels",
				children: session.pass?.levels.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `bottle-pass__level${session.pass && session.pass.points >= l.points ? " bottle-pass__level--active" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							disabled: busy,
							onClick: () => {
								setRewards(l.premium);
								setNested("reward-info");
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rewards, {
								assets,
								rewards: l.premium
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i + 1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rewards, {
							assets,
							rewards: l.free
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "button--confirm",
							disabled: busy || l.claimed || !session.viewerId || (session.pass?.points ?? 0) < l.points,
							onClick: () => void act("pass-claim", {
								level: i,
								track: "free"
							}),
							children: t(l.claimed ? "dlg:bottle_pass:reward:collected" : "dlg:bottle_pass:collect")
						})] })
					]
				}, i))
			}),
			!session.pass && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				children: t("dlg:music:unavailable")
			})
		]
	});
	const closeNested = () => {
		setNested(null);
		setSelectedLeague(null);
	};
	const leagueMain = feature === "league" && Boolean(session.league), leagueMove = feature === "league" && !session.league;
	const leagueLeft = session.league?.state === "running" ? Math.round(Math.max(0, session.league.endsAt - now) / 1e3) : void 0;
	const leagueFrame = leagueMain ? {
		className: "league__x_popup",
		headerClass: `league__x_popup__header league__x_popup__header--${leagueHeaderState}`,
		titleClass: "league__x_popup__title",
		closeIconClass: "league__x_popup__close-icon",
		manualClass: "league__manual",
		contentClass: "popup__content--no-padding popup__content--no-scroll league__x_popup__content"
	} : leagueMove ? {
		className: "source-league-move-popup",
		manualClass: "league-move__manual",
		contentClass: "popup__content--center",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup__buttons",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "button button--confirm",
				onClick: onClose,
				children: t("dlg:harem:btn")
			})
		})
	} : {};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title,
			onClose,
			help: feature === "roulette" ? void 0 : () => setNested("help"),
			inactive: Boolean(nested),
			className: feature === "roulette" ? "source-roulette-popup roulette__x_popup" : "",
			...leagueFrame,
			children: [body, message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				role: "status",
				children: message
			})]
		}),
		leagueMain && leagueLeft !== void 0 && !nested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "source-toast-layer",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toast toast--bottom toast--show toast--icon",
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "toast__icon toast__icon--timer"
				}), leagueLeft <= 0 ? t("dlg:league:processing") : `${t("dlg:top:timer:results_in")}: ${shortText(leagueLeft, t)}`]
			})
		}),
		nested === "help" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t(feature === "league" ? "dlg:league:manual:title" : feature === "roulette" ? "roulette:help:header" : "dlg:bottle_pass_info:title"),
			onClose: closeNested,
			className: feature === "roulette" ? "source-roulette-help" : "",
			children: [(feature === "league" ? [
				"league:help:page1",
				"league:help:page2:text1",
				"league:help:page2:text2",
				"league:help:page2:text3",
				"league:help:page2:text4",
				"league:help:page2:text5",
				"league:help:page2:text6",
				"league:help:page3",
				"league:help:page4"
			] : feature === "roulette" ? [
				"roulette:help:desc1",
				"roulette:help:desc2",
				"roulette:help:desc3"
			] : [
				"dlg:bottle_pass_info:desc1",
				"dlg:bottle_pass_info:desc2",
				"dlg:bottle_pass_info:desc3",
				"dlg:bottle_pass_info:desc4",
				"dlg:bottle_pass_info:desc5",
				"dlg:bottle_pass_info:desc6"
			]).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: feature === "roulette" ? "source-roulette-help-row" : "source-feature-message",
				children: [feature === "roulette" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: `source-roulette-help-art source-roulette-help-art--${key.slice(-1)}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t(key) }) })]
			}, key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup__buttons",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "button--confirm",
					onClick: closeNested,
					children: t("roulette:help:btn")
				})
			})]
		}),
		nested === "chances" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t("roulette:main:panel1:chances"),
			onClose: closeNested,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				children: session.roulette ? `${session.roulette.bundleChances ?? "—"} şans · ${session.roulette.bundleDat ?? "—"} DAT` : "Çarx məlumatları alınmadı."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup__buttons",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "button--confirm",
					disabled: !session.roulette || session.roulette.enabled === false || !session.viewerId || busy,
					onClick: () => void act("roulette-buy-chances"),
					children: "Şans al"
				})
			})]
		}),
		nested === "ladder" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceFeaturePopup, {
			title: t("dlg:league:ladder:title"),
			onClose: closeNested,
			className: "source-league-popup league-ladder__x_popup",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "league-ladder",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league-ladder__description",
					children: t("dlg:league:ladder:desc")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league-ladder__list",
					children: assets.leagues?.map((l, i) => ({
						l,
						i
					})).reverse().map(({ l, i }) => {
						const locked = i > (session.league?.maxLeague ?? 16);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: `league-ladder__item${i === (session.league?.level ?? session.leagueLevel) ? " league-ladder__item--current-viewer" : ""}`,
							onClick: () => !locked && info(i),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "league-ladder__league",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
										assets,
										name: l.image,
										size: 50
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "league-ladder__league-title",
										children: t(`dlg:league:${i}`)
									}),
									locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "league-ladder__in-dev",
										children: t("dlg:league:ladder:in_dev")
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `league-ladder__icon${locked ? " league-ladder__icon--locked" : ""}` })]
						}, i);
					})
				})]
			})
		}),
		nested === "limit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t("dlg:league:limit:title"),
			onClose: closeNested,
			className: "source-league-popup league-limit__x_popup",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "league-limit",
				children: [(session.league?.limit === "gift" || session.league?.limit === "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "league-limit__row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "league-limit__icon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "league-limit__text",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t("dlg:league:limit:gift") })
					})]
				}), (session.league?.limit === "kiss" || session.league?.limit === "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "league-limit__row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "league-limit__icon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "league-limit__text",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t("dlg:league:limit:kiss") })
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup__buttons",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "button--confirm",
					onClick: closeNested,
					children: t("dlg:top:help:ok")
				})
			})]
		}),
		nested === "result" && leagueResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t(leagueResult === "up" ? "dlg:league_result:title_win" : "dlg:league_result:title"),
			onClose: closeNested,
			className: "source-league-move-popup",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "league-move",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `league-move__cups league-move__cups--${leagueResult}`,
					children: [
						leagueResult === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
							assets,
							name: assets.leagues?.[Math.max(0, (session.leagueLevel ?? 1) - 1)]?.image ?? "",
							size: 66
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
							assets,
							name: assets.leagues?.[session.leagueLevel ?? 0]?.image ?? "",
							size: leagueResult === "stay" ? 80 : 80
						}),
						leagueResult === "down" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
							assets,
							name: assets.leagues?.[Math.min(16, (session.leagueLevel ?? 0) + 1)]?.image ?? "",
							size: 66
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "league-move__description",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t(leagueResult === "up" ? "dlg:league_result:desc_up" : leagueResult === "down" ? "dlg:league_result:desc_down" : (session.leagueLevel ?? 0) >= (session.league?.maxLeague ?? 16) ? "dlg:league_result:desc_stay_final" : "dlg:league_result:desc_stay") })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup__buttons",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "button button--confirm",
					onClick: closeNested,
					children: t("dlg:league_result:btn")
				})
			})]
		}),
		nested === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t("dlg:bottle_pass:premium_pass"),
			onClose: closeNested,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "source-feature-message",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { text: t("dlg:bottle_pass_info:desc2") })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup__buttons",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "button--confirm",
					disabled: !session.pass || !session.viewerId || busy || session.pass.premium,
					onClick: () => void act("pass-buy"),
					children: t(session.pass?.premium ? "dlg:premium_pass:purchased" : "dlg:premium_pass:buy")
				})
			})]
		}),
		nested === "reward" && feature === "roulette" && rewards[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouletteRewardAnimation, {
			reward: rewards[0],
			template: assets.sfxUrl,
			onFinish: closeNested
		}),
		(nested === "reward-info" || nested === "reward" && feature !== "roulette") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t(nested === "reward" ? "dlg:bottle_pass:reward:achieved" : selectedLeague !== null ? `dlg:league:${selectedLeague}` : "dlg:bottle_pass_reward_info:title"),
			onClose: () => selectedLeague !== null ? (setSelectedLeague(null), setNested("ladder")) : closeNested(),
			className: nested === "reward" && feature === "roulette" ? "source-roulette-reward-popup" : "",
			children: [
				selectedLeague !== null && assets.leagues?.[selectedLeague] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
						assets,
						name: assets.leagues[selectedLeague].image,
						size: 85
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "source-feature-message",
						children: t("dlg:league_reward:desc")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "source-feature-rewards",
						children: (assets.leagues[selectedLeague - 1] ?? assets.leagues[selectedLeague]).gifts?.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$2, {
							assets,
							name: assets.gifts[id]?.storeImage ?? ""
						}, id))
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rewards, {
					assets,
					rewards
				}),
				nested === "reward-info" && feature === "bottle-pass" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "source-feature-message",
					children: t(session.pass?.premium ? "dlg:bottle_pass:reward:level_block" : "dlg:bottle_pass:reward:pass_block")
				}),
				nested === "reward" && feature === "roulette" && rewards.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "source-feature-message",
					children: [
						r.count,
						" × ",
						roulettePrizeNames[r.image] ?? r.image
					]
				}, r.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__buttons",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "button--confirm",
						onClick: closeNested,
						children: t("dlg:navigate_vip:btn")
					})
				})
			]
		})
	] }), document.body);
}
var ui_btn_league_default = "/assets/ui_btn_league-C8EMHxRz.svg";
/** Original LeagueButton states; rank and time strings remain host-owned. */
function SourceLeagueButton({ onClick }) {
	const { leagueHeader: info, league, leagueState } = useSourceFeatureSession();
	const running = info?.type === "running";
	const limit = league?.limit;
	const pill = running ? info.leftTimeShortText?.replaceAll("&nbsp;", "\xA0") : info?.type === "finished" ? info.positionText : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		"aria-label": "Liqa",
		title: "Liqa",
		"aria-haspopup": "dialog",
		onClick: () => {
			if (canOpenLeague(leagueState)) onClick();
			else showSourceToast("Liqalarda yarışmağa başlamaq üçün 100 öpüş almalısınız");
		},
		className: "original-header-button original-icon-default original-league-button",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ui_btn_bg_up_default,
				alt: "",
				className: "original-button-background original-button-up"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ui_btn_bg_down_default,
				alt: "",
				className: "original-button-background original-button-down"
			}),
			running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "original-league-position",
				children: info.positionText ?? "—"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ui_btn_league_default,
				alt: "",
				className: "original-button-icon"
			}),
			pill && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "original-league-info",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='40px'%20height='16px'%20viewBox='0%200%2040%2016'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle%3eRectangle%3c/title%3e%3cg%20id='Page-1'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3crect%20id='Rectangle'%20fill='%23FFFFFF'%20x='0'%20y='0'%20width='40'%20height='16'%20rx='8'%3e%3c/rect%3e%3c/g%3e%3c/svg%3e",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pill })]
			}),
			info?.type === "welcome" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "original-league-info original-league-welcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='18px'%20height='18px'%20viewBox='0%200%2018%2018'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle%3eOval%3c/title%3e%3cg%20id='Page-1'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3ccircle%20id='Oval'%20fill='%23FFFFFF'%20cx='9'%20cy='9'%20r='9'%3e%3c/circle%3e%3c/g%3e%3c/svg%3e",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "!" })]
			}),
			running && limit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "original-league-info original-league-welcome original-league-limit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='18px'%20height='18px'%20viewBox='0%200%2018%2018'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle%3eOval%3c/title%3e%3cg%20id='Page-1'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3ccircle%20id='Oval'%20fill='%23FFFFFF'%20cx='9'%20cy='9'%20r='9'%3e%3c/circle%3e%3c/g%3e%3c/svg%3e",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "!" })]
			})
		]
	});
}
var ui_btn_bottle_pass_default = "data:image/svg+xml,%3csvg%20width='17'%20height='18'%20viewBox='0%200%2017%2018'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cdefs%3e%3cpath%20id='a'%20d='M0%20.207h16.933V17H0z'/%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3cg%20transform='translate(0%20.293)'%3e%3cmask%20id='b'%20fill='%23fff'%3e%3cuse%20xlink:href='%23a'/%3e%3c/mask%3e%3cpath%20d='M7.07%2014.75c.2%200%20.45.05.65.05l6.993-6.993c-.1-.35-.1-.7-.05-1.1l-.55-.5c-.15%200-.3.05-.45.05-.75%200-1.45-.3-2-.85a2.8%202.8%200%200%201-.8-2.45l-.55-.55c-.15%200-.3.05-.45.05-.2%200-.45%200-.65-.05L2.22%209.35c.1.35.1.75.05%201.1l.55.55c.15%200%20.3-.05.45-.05.75%200%201.45.3%202%20.85.65.65.95%201.55.8%202.45l.55.55c.15%200%20.3-.05.45-.05m.9%202.25a.97.97%200%200%201-.5-.15c-.15-.05-.25-.1-.4-.1-.1%200-.2%200-.35.05-.15.05-.25.1-.4.1-.25%200-.5-.1-.7-.3l-1.4-1.35c-.3-.3-.35-.7-.2-1.1.15-.3.05-.7-.2-.95a.83.83%200%200%200-.6-.25c-.1%200-.25%200-.35.05-.15.05-.25.1-.4.1-.25%200-.5-.1-.7-.3l-1.4-1.4c-.3-.3-.35-.7-.2-1.1.1-.25.1-.5-.05-.75-.2-.4-.15-.9.15-1.2L8.263.507c.2-.2.45-.3.7-.3.15%200%20.35.05.5.15.15.05.25.1.4.1.1%200%20.25%200%20.35-.05.15-.05.25-.1.4-.1.25%200%20.5.1.7.3l1.4%201.35c.3.3.35.7.2%201.1-.15.3-.05.7.2.95.15.15.35.25.6.25.1%200%20.25%200%20.35-.05.15-.05.25-.1.4-.1.25%200%20.5.1.7.3l1.4%201.4c.3.3.35.7.2%201.1-.1.25-.1.5.05.75.2.4.15.9-.15%201.2L8.67%2016.7c-.2.2-.45.3-.7.3'%20fill='%23E0B993'%20mask='url(%23b)'/%3e%3c/g%3e%3cpath%20d='M8.963%201c-.15%200-.25.05-.35.15L.72%209.043c-.15.15-.2.4-.05.6.15.4.2.8%200%201.2-.05.2%200%20.4.15.55l1.4%201.4c.1.1.2.15.35.15.05%200%20.15%200%20.2-.05.15-.05.35-.1.55-.1.35%200%20.7.15.95.4.4.4.5%201%20.3%201.5-.1.2-.05.4.1.55l1.4%201.4c.1.1.2.15.35.15.05%200%20.15%200%20.2-.05.15-.05.35-.1.55-.1.2%200%20.45.05.65.15.1.05.2.05.25.05.15%200%20.25-.05.35-.15l7.793-7.943c.15-.15.2-.4.05-.6-.2-.35-.2-.8-.05-1.15.1-.2.05-.4-.1-.55l-1.4-1.4c-.1-.1-.2-.15-.35-.15-.05%200-.15%200-.2.05-.15.05-.35.1-.55.1-.35%200-.7-.15-.95-.4-.4-.4-.5-1-.3-1.5.1-.2.05-.4-.1-.55l-1.3-1.35c-.1-.1-.2-.15-.35-.15-.05%200-.15%200-.2.05-.2.05-.35.1-.55.1-.2%200-.45-.05-.65-.15-.05-.1-.15-.1-.25-.1m.1%201.1c.3.1.55.15.8.15.2%200%20.4-.05.6-.1l.95.95c-.2.8%200%201.65.6%202.25.45.45%201.05.7%201.65.7.2%200%20.4-.05.6-.1l.95.95c-.1.45-.1.95.05%201.35L7.87%2015.693c-.25-.1-.5-.15-.8-.15-.2%200-.4.05-.6.1l-.95-.95c.2-.8%200-1.65-.6-2.25-.45-.45-1.05-.7-1.65-.7-.2%200-.4.05-.6.1l-.95-.95c.1-.45.1-.95-.05-1.35L9.063%202.1'%20fill='%23FFF'/%3e%3cpath%20d='m10.707%2010.6-.293-1.233.973-.81a.783.783%200%200%200%20.247-.843.782.782%200%200%200-.687-.547l-1.262-.102-.47-1.177a.786.786%200%200%200-1.458-.01L7.27%207.047l-1.264.083a.784.784%200%200%200-.695.536.785.785%200%200%200%20.234.847l.96.825-.31%201.228a.786.786%200%200%200%201.173.866l1.08-.66%201.073.676a.785.785%200%200%200%201.186-.848'%20fill='%23E0B993'/%3e%3cpath%20d='m6.68%2010.688.387-1.528-1.196-1.027a.287.287%200%200%201%20.168-.505l1.573-.103.607-1.455a.288.288%200%200%201%20.532.003l.584%201.465%201.572.127c.257.021.359.343.16.508L9.856%209.18l.364%201.534a.287.287%200%200%201-.433.31l-1.333-.842-1.346.821a.288.288%200%200%201-.429-.316'%20fill='%23FFF'/%3e%3c/g%3e%3c/svg%3e";
var SeasonPassDialog = (0, import_react.lazy)(() => import("./season-pass-dialog-C2qfn81o.mjs").then((m) => ({ default: m.SeasonPassDialog })));
/** Header BottlePassButton: ticket icon, "21 gün" season pill and a red dot when a reward can be collected. */
function SeasonPassButton({ skin }) {
	const info = (0, import_react.useSyncExternalStore)(subscribePass, getCachedPass, () => null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		fetchPassInfo();
		const tick = window.setInterval(() => setNow(Date.now()), 3e4);
		const refresh = window.setInterval(() => void fetchPassInfo(), 12e4);
		return () => {
			window.clearInterval(tick);
			window.clearInterval(refresh);
		};
	}, []);
	const t = info ? now + (info.now_ms - Date.now()) : now;
	const left = info ? info.finish_ms - t : 0;
	const dot = hasClaimable(info, t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		"aria-label": "Mövsümi icazənamə",
		title: "Mövsümi icazənamə",
		"aria-haspopup": "dialog",
		onClick: () => setOpen(true),
		className: "original-header-button original-icon-bottle-pass original-league-button",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: skin?.[0] ?? "/assets/ui_btn_bg_up-Dz3OrZ68.svg",
				alt: "",
				className: "original-button-background original-button-up"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: skin?.[1] ?? "/assets/ui_btn_bg_down-ypCwPjVm.svg",
				alt: "",
				className: "original-button-background original-button-down"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ui_btn_bottle_pass_default,
				alt: "",
				className: "original-button-icon"
			}),
			info && left > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "original-league-info",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='40px'%20height='16px'%20viewBox='0%200%2040%2016'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle%3eRectangle%3c/title%3e%3cg%20id='Page-1'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3crect%20id='Rectangle'%20fill='%23FFFFFF'%20x='0'%20y='0'%20width='40'%20height='16'%20rx='8'%3e%3c/rect%3e%3c/g%3e%3c/svg%3e",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: passShortLeft(left) })]
			}),
			dot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				style: {
					position: "absolute",
					top: 1,
					right: 1,
					width: 9,
					height: 9,
					borderRadius: "50%",
					background: "#ff4b1f",
					border: "1.5px solid #fff"
				}
			})
		]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeasonPassDialog, { onClose: () => {
			setOpen(false);
			fetchPassInfo();
		} })
	})] });
}
var EMBEDDED_IMAGES = [
	"baby",
	"champagne",
	"champagnebot",
	"cognac",
	"cola",
	"jackdaniels",
	"ketchup",
	"lemonade",
	"martini",
	"martinibot",
	"milk",
	"milkbot",
	"nybottle",
	"pirate",
	"ship",
	"skeleton",
	"skewer",
	"sprite",
	"standart",
	"vipbottle",
	"vodka",
	"vodkabot",
	"yacht"
];
var cls$4 = (el, mods = []) => {
	const b = el ? `change-table__${el}` : "change-table";
	return [b, ...mods.filter(Boolean).map((m) => `${b}--${m}`)].join(" ");
};
var press = (fn) => ({
	role: "button",
	tabIndex: 0,
	onClick: fn,
	onKeyDown: (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			fn();
		}
	}
});
var mmss = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
function Stats({ men, women, timer }) {
	const [timerSub, setTimerSub] = (0, import_react.useState)(""), [playersSub, setPlayersSub] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (timer === void 0) {
			setTimerSub("");
			setPlayersSub("");
		} else if (timer === "00:00") {
			setTimerSub("hide");
			setPlayersSub("show");
		} else {
			setTimerSub((v) => v || "show");
			setPlayersSub((v) => v || "hide");
		}
	}, [timer]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls$4("stats"),
		children: [timer !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cls$4("kickout-timer", [timerSub]),
			children: timer
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$4("stats-players", [playersSub]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$4("men"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$4("stats-icon", ["men"]) }), men]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$4("women"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$4("stats-icon", ["women"]) }), women]
			})]
		})]
	});
}
function SourceChangeTable({ onClose }) {
	const assets = useCilizAssets(), session = useSourceFeatureSession();
	const isAdmin = useIsChatAdmin();
	const [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)(""), [now, setNow] = (0, import_react.useState)(Date.now()), [info, setInfo] = (0, import_react.useState)(null);
	const [fullTable, setFullTable] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, []);
	if (!assets) return null;
	const t = (key) => translate(assets, key);
	const change = async (id) => {
		if (busy) return;
		setBusy(true);
		setMessage("");
		try {
			const result = await executeSourceFeature("change-table", id ? { tableId: id } : void 0);
			if (result.confirmed) onClose();
			else if (result.message === "table_full" || result.message === "Masa dolu") setFullTable(id ?? "");
			else setMessage(result.message ?? t("dlg:music:unavailable"));
		} catch (e) {
			setMessage(gameError(e));
		} finally {
			setBusy(false);
		}
	};
	const timerOf = (e) => {
		if (!e.blockedUntil) return void 0;
		return mmss(Math.max(0, Math.ceil((e.blockedUntil - now) / 1e3)));
	};
	const click = (e, timer) => () => {
		if (timer && timer !== "00:00") setInfo(e);
		else change(e.id);
	};
	const infoDesc = (e) => {
		const k = e.kicker;
		return translate(assets, "kickout:info:desc", k?.name ?? "", e.id).replace(/%2d\(([^|]+)\|([^)]+)\)/g, (_m, a, b) => k?.male === false ? b : a).replace(/<\/?styled>/g, "").replace(/<\/?b>/g, "");
	};
	const PlayerItem = (e) => {
		const timer = timerOf(e);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$4("item"),
			"aria-label": e.name ?? `#${e.id}`,
			...press(click(e, timer)),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$4("info"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cls$4("photo"),
					style: e.photo ? { backgroundImage: `url(${e.photo})` } : void 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cls$4("item-border"),
					children: e.name
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {
				men: e.men,
				women: e.women,
				timer
			})]
		}, `f${e.id}`);
	};
	const TableItem = (e) => {
		const timer = timerOf(e), image = EMBEDDED_IMAGES.includes(e.bottle) ? e.bottle : "standart";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$4("item"),
			"aria-label": `#${e.id}`,
			...press(click(e, timer)),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$4("info"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cls$4("table-icon"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$4("bottle", [image]) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cls$4("item-border"),
					children: ["#", e.id]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {
				men: e.men,
				women: e.women,
				timer
			})]
		}, `h${e.id}`);
	};
	const friends = session.tables?.friends ?? [], tables = session.tables?.history ?? [];
	const isBrokenBorders = /Android 8\.1\.0.*Chrome\/(91|94)/.test(navigator.userAgent);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceFeaturePopup, {
			title: t("dlg:change_table:title"),
			onClose,
			contentClass: "popup__content--no-padding",
			footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__footer change-table__x_popup__footer" }),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cls$4("", [isBrokenBorders ? "" : "support-borders"]),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cls$4("random-button"),
							"aria-disabled": busy || !session.viewerId,
							...press(() => {
								if (session.viewerId) change();
							}),
							children: t("dlg:change_table:btn_random2")
						}),
						session.tables?.canViewById && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: cls$4("view-form"),
							onSubmit: (e) => {
								e.preventDefault();
								const v = inputRef.current?.value ?? "";
								if (/^\d+$/.test(v)) change(String(Number(v)));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "table-id",
								className: cls$4("subtitle", ["input"]),
								children: "Masanı göstər"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cls$4("input-line"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										id: "table-id",
										className: cls$4("input"),
										placeholder: "Masa nömrəsi",
										step: "1",
										min: "0",
										ref: inputRef,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "validity" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: cls$4("submit"),
										type: "submit",
										value: "Keç",
										disabled: busy
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cls$4("items"),
							children: [
								friends.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cls$4("subtitle"),
									children: t("ios:dlg:change_table:desc_friends_and_fellows")
								}),
								friends.map(PlayerItem),
								friends.length > 0 && tables.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$4("border") }),
								tables.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cls$4("subtitle"),
									children: t("dlg:change_table:desc_recent2")
								}),
								tables.map(TableItem)
							]
						})
					]
				}),
				!session.viewerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "source-feature-message",
					children: t("dlg:music:unavailable")
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "status",
					className: "source-feature-message",
					children: message
				})
			]
		}),
		info && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceFeaturePopup, {
			title: t("kickout:info:header"),
			onClose: () => setInfo(null),
			className: "source-kickout-popup",
			footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, { confirm: {
				title: t("kickout:help:btn_ok"),
				onClick: () => setInfo(null)
			} }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "kickout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "kickout__user",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "kickout__photo",
						children: [info.kicker?.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: info.kicker.photo,
							alt: info.kicker.name
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "kickout__icon kickout__icon--kicked" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__description",
						children: infoDesc(info)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "kickout__info",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__info-text",
						children: t("kickout:info:return")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__info-time",
						children: Math.max(0, Math.ceil(((info.blockedUntil ?? now) - now) / 1e3))
					})]
				})]
			})
		}),
		fullTable !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceFeaturePopup, {
			title: "Boş yer yoxdur",
			onClose: () => setFullTable(null),
			className: "source-kickout-popup",
			footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, { confirm: {
				title: "Başqa masa seç",
				onClick: () => setFullTable(null)
			} }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "kickout",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kickout__description",
					style: { whiteSpace: "pre-line" },
					children: `Masa ${fullTable} ətrafında boş yer yoxdur.\nLütfən boş yer üçün gözlə.`
				})
			})
		})
	] }), document.body);
}
/** Ciliz header: the table ID chip (chat:room_title label + room number) is admin-only. */
function TableIdChip({ roomId, label }) {
	if (!useIsChatAdmin()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "original-header-table",
		"aria-label": `Masa ${roomId}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "original-header-table-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "original-header-table-id",
			children: roomId
		})]
	});
}
var middleIcons = [{
	asset: ui_btn_misc_menu_default,
	label: "Menyu",
	kind: "menu"
}, {
	asset: ui_btn_settings_default,
	label: "Ayarlar",
	kind: "default"
}];
function OriginalIcon({ asset, label, kind, onClick }) {
	const [backgroundUp, backgroundDown] = useHeaderSkin();
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		onClick,
		"aria-label": label,
		title: label,
		className: `original-header-button original-icon-${kind}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: backgroundUp,
				alt: "",
				className: "original-button-background original-button-up"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: backgroundDown,
				alt: "",
				className: "original-button-background original-button-down"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset,
				alt: "",
				className: "original-button-icon"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		variant: "ghost",
		className: `original-header-button original-icon-${kind}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: asset,
			target: "_blank",
			rel: "noreferrer",
			"aria-label": `${label} şəkli`,
			title: label,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: backgroundUp,
					alt: "",
					className: "original-button-background original-button-up"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: backgroundDown,
					alt: "",
					className: "original-button-background original-button-down"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: asset,
					alt: label,
					className: "original-button-icon"
				})
			]
		})
	});
}
/** applyHeaderSkin: header buttons take the colours of the chosen table background. */
function useHeaderSkin() {
	const bg = useTableBg();
	return [headerBtnSvg(bg, false) ?? "/assets/ui_btn_bg_up-Dz3OrZ68.svg", headerBtnSvg(bg, true) ?? "/assets/ui_btn_bg_down-ypCwPjVm.svg"];
}
function OriginalTableHeader() {
	const [backgroundUp, backgroundDown] = useHeaderSkin();
	const [tableBgOpen, setTableBgOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const room = useRoom();
	const pending = (0, import_react.useSyncExternalStore)(subscribePendingGold, getPendingGold, () => 0);
	const rawGold = room.players[5]?.gold;
	const gold = rawGold == null ? rawGold : Math.max(0, rawGold - pending);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [changeOpen, setChangeOpen] = (0, import_react.useState)(false);
	const [changeCount, setChangeCount] = (0, import_react.useState)(9);
	(0, import_react.useEffect)(() => {
		if (room.roomId === null) return;
		let n = 9;
		setChangeCount(n);
		const id = window.setInterval(() => {
			n -= 1;
			setChangeCount(n);
			if (n < 1) window.clearInterval(id);
		}, 1e3);
		return () => window.clearInterval(id);
	}, [room.roomId]);
	const [season, setSeason] = (0, import_react.useState)(null);
	const closeSettings = (0, import_react.useCallback)(() => setSettingsOpen(false), []);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const menuTriggerRef = (0, import_react.useRef)(null);
	const [decorOpen, setDecorOpen] = (0, import_react.useState)(false);
	const [bottleOpen, setBottleOpen] = (0, import_react.useState)(false);
	const [bankOpen, setBankOpen] = (0, import_react.useState)(false);
	const [topsOpen, setTopsOpen] = (0, import_react.useState)(false);
	const [vipOpen, setVipOpen] = (0, import_react.useState)(false);
	const vipAssets = useCilizAssets();
	const [boostersOpen, setBoostersOpen] = (0, import_react.useState)(false);
	const [achievementsOpen, setAchievementsOpen] = (0, import_react.useState)(false);
	const closeBank = (0, import_react.useCallback)(() => setBankOpen(false), []);
	const closeBottle = (0, import_react.useCallback)(() => setBottleOpen(false), []);
	const closeMenu = (0, import_react.useCallback)(() => setMenuOpen(false), []);
	const closeDecor = (0, import_react.useCallback)(() => setDecorOpen(false), []);
	const onMenuSelect = (0, import_react.useCallback)((id) => {
		if (id === "decor") setDecorOpen(true);
		if (id === "bottle") setBottleOpen(true);
		if (id === "tablebg") setTableBgOpen(true);
		if (id === "tops") setTopsOpen(true);
		if (id === "boosters") setBoostersOpen(true);
		if (id === "achievements") setAchievementsOpen(true);
	}, []);
	(0, import_react.useEffect)(() => {
		const tops = () => setTopsOpen(true), vip = () => setVipOpen(true), gold = () => setBankOpen(true), decor = () => setDecorOpen(true);
		window.addEventListener(OPEN_TOPS_EVENT, tops);
		window.addEventListener(OPEN_VIP_EVENT, vip);
		window.addEventListener(OPEN_BANK_EVENT, gold);
		window.addEventListener(OPEN_DECOR_EVENT, decor);
		return () => {
			window.removeEventListener(OPEN_TOPS_EVENT, tops);
			window.removeEventListener(OPEN_VIP_EVENT, vip);
			window.removeEventListener(OPEN_BANK_EVENT, gold);
			window.removeEventListener(OPEN_DECOR_EVENT, decor);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "original-table-header",
		"aria-label": "Orijinal üst masa ikonları",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "original-header-wallet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					className: "original-header-button original-heart-button",
					"aria-label": "Ürək al",
					title: "Ürək al",
					"aria-haspopup": "dialog",
					onClick: () => setBankOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ui_btn_gold_add_heart_up_default,
						alt: "",
						className: "original-heart-image original-button-up"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ui_btn_gold_add_heart_down_default,
						alt: "",
						className: "original-heart-image original-button-down"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("output", {
					className: "original-header-balance",
					"aria-label": "Ürək balansı",
					"aria-live": "polite",
					style: { width: `${String(gold ?? "—").length}ch` },
					children: gold ?? "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "original-header-middle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeasonPassButton, { skin: [backgroundUp, backgroundDown] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceLeagueButton, { onClick: () => setSeason("league") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalIcon, {
						asset: ui_btn_roulette_default,
						label: "Şans çarxı",
						kind: "default",
						onClick: () => setSeason("roulette")
					}),
					middleIcons.map((icon) => icon.kind === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						ref: menuTriggerRef,
						type: "button",
						variant: "ghost",
						className: "original-header-button original-icon-menu",
						"aria-label": "Menyu",
						title: "Menyu",
						"aria-expanded": menuOpen,
						"aria-controls": "original-misc-menu",
						"aria-haspopup": "dialog",
						onClick: () => setMenuOpen((value) => !value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: backgroundUp,
								alt: "",
								className: "original-button-background original-button-up"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: backgroundDown,
								alt: "",
								className: "original-button-background original-button-down"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ui_btn_misc_menu_default,
								alt: "",
								className: "original-button-icon"
							})
						]
					}, icon.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalIcon, {
						...icon,
						onClick: icon.label === "Ayarlar" ? () => setSettingsOpen(true) : void 0
					}, icon.label)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "original-header-button original-icon-back",
						"aria-label": "Əsas səhifəyə qayıt",
						title: "Geri",
						onClick: () => void navigate({ to: "/" }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: backgroundUp,
								alt: "",
								className: "original-button-background original-button-up"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: backgroundDown,
								alt: "",
								className: "original-button-background original-button-down"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
								className: "original-button-icon",
								"aria-hidden": "true"
							})
						]
					})
				]
			}),
			room.roomId !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableIdChip, {
				roomId: room.roomId,
				label: vipAssets ? translate(vipAssets, "chat:room_title") : ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				"aria-label": "Masanı dəyiş",
				title: "Masanı dəyiş",
				"aria-disabled": changeCount >= 1,
				onClick: () => {
					if (changeCount < 1) setChangeOpen(true);
					else showSourceToast((vipAssets?.translation["hint:change_room:waiting"] ?? "Masanı dəyişmək üçün % saniyə gözləyin").replace(/%0?/, String(Number.isFinite(changeCount) ? changeCount : 9)));
				},
				className: `original-header-button original-icon-default${changeCount >= 1 ? " original-change-table--count" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: backgroundUp,
						alt: "",
						className: "original-button-background original-button-up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: backgroundDown,
						alt: "",
						className: "original-button-background original-button-down"
					}),
					changeCount >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "original-change-table-count",
						children: changeCount
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ui_btn_change_table_default,
						alt: "",
						className: "original-button-icon"
					})
				]
			}),
			changeOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceChangeTable, { onClose: () => setChangeOpen(false) }),
			season && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceSeasonDialog, {
				feature: season,
				onClose: () => setSeason(null),
				onSettings: () => {
					setSeason(null);
					setSettingsOpen(true);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {
				open: settingsOpen,
				onClose: closeSettings
			}),
			topsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTopsDialog, { onClose: () => setTopsOpen(false) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceAchievementNotifications, {}),
			boostersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBoostersDialog, { onClose: () => setBoostersOpen(false) }),
			achievementsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceAchievementsDialog, { onClose: () => setAchievementsOpen(false) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalMiscMenu, {
				open: menuOpen,
				triggerRef: menuTriggerRef,
				onClose: closeMenu,
				onSelect: onMenuSelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecorSelection, {
				open: decorOpen,
				onClose: closeDecor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleSelection, {
				open: bottleOpen,
				onClose: closeBottle
			}),
			tableBgOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBgDialog, { onClose: () => setTableBgOpen(false) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankDialog, {
				open: bankOpen,
				onClose: closeBank,
				isVip: true,
				onVip: () => setVipOpen(true)
			}),
			vipOpen && vipAssets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VipDialog, {
				assets: vipAssets,
				onClose: () => setVipOpen(false),
				onBought: closeBank
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceToastHost, {})
		]
	});
}
/** Original MessageActionsDialog: no heading, close control, source settings icons. */
function MessageActions({ assets, blocked, translationShown, canTranslate, busy, onClose, onIgnore, onReport, onTranslate, onDelete, isOwn = false }) {
	(0, import_react.useEffect)(() => {
		const close = (event) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", close);
		return () => document.removeEventListener("keydown", close);
	}, [onClose]);
	const items = isOwn ? [] : [
		{
			key: blocked ? "dlg:unblock:title" : "dlg:block:title",
			icon: "ignore",
			action: onIgnore
		},
		{
			key: "dlg:report_issue:title",
			icon: "complain",
			action: onReport
		},
		...canTranslate ? [{
			key: translationShown ? "dlg:translate:show_original" : "dlg:translate:show_translation",
			icon: "translate",
			action: onTranslate
		}] : []
	];
	if (onDelete) items.push({
		key: "admin:delete",
		icon: "complain",
		action: onDelete,
		label: "Mesajı sil"
	});
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "source-feature-layer source-message-actions",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup-shade",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": translate(assets, "dlg:report_issue:title"),
			className: "popup popup--center popup--show message-actions__x_popup",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "popup__close popup__close--dlg",
				"aria-label": "Bağla",
				onClick: onClose,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
			}), items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				disabled: busy,
				className: "settings__item settings__item--selectable",
				onClick: item.action,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `settings__icon settings__icon--${item.icon}` }), item.label ?? translate(assets, item.key)]
			}, item.key))]
		})]
	}), document.body);
}
var DESIGN_TO_TABLE = .1 * (64 / 102);
var TRANSPARENT_ALPHA = .001;
var Obj = class {
	el;
	x = 0;
	y = 0;
	rotation = 0;
	scaleX = 1;
	scaleY = 1;
	alpha = 1;
	constructor(el) {
		this.el = el;
		el.style.position = "absolute";
	}
	draw() {
		const t = [
			this.x || this.y ? `translate3d(${this.x}px, ${this.y}px, 0)` : "",
			this.scaleX !== 1 || this.scaleY !== 1 ? `scale(${this.scaleX}, ${this.scaleY})` : "",
			this.rotation ? `rotate(${this.rotation}deg)` : ""
		].join(" ").trim();
		this.el.style.transform = t || "none";
		this.el.style.opacity = this.alpha === 1 ? "" : String(this.alpha);
	}
};
function createHintAsset(parent) {
	const div = (c) => {
		const d = document.createElement("div");
		d.className = `interactive-hints__${c}`;
		return d;
	};
	const root = div("container"), text = div("text-container"), send = div("send-button"), handBox = div("hand-container"), hand = div("hand-image");
	const circles = [
		div("circle"),
		div("circle"),
		div("circle")
	];
	circles.forEach((c) => handBox.appendChild(c));
	handBox.appendChild(send);
	handBox.appendChild(hand);
	root.appendChild(handBox);
	root.appendChild(text);
	parent.appendChild(root);
	const a = {
		root: new Obj(root),
		pointer: new Obj(handBox),
		hand: new Obj(hand),
		text: new Obj(text),
		send: new Obj(send),
		circles: circles.map((c) => new Obj(c)),
		all: []
	};
	a.circles.forEach((c) => {
		c.el.style.position = "relative";
	});
	a.all = [
		a.root,
		a.pointer,
		a.hand,
		a.text,
		a.send,
		...a.circles
	];
	a.root.alpha = 0;
	a.all.forEach((o) => o.draw());
	return a;
}
/** Minimal AnimationManager timeline: absolute-time tweens and callbacks. */
var Timeline = class {
	redraw;
	items = [];
	t0 = performance.now();
	raf = 0;
	constructor(redraw) {
		this.redraw = redraw;
		this.loop();
	}
	add(at, item) {
		this.items.push(typeof item === "function" ? {
			at,
			dur: 0,
			run: () => item()
		} : {
			at,
			...item
		});
	}
	tween(o, dur, to) {
		let from = {};
		return {
			dur,
			run: (k) => {
				if (!Object.keys(from).length) for (const key of Object.keys(to)) from[key] = o[key];
				for (const key of Object.keys(to)) o[key] = from[key] + (to[key] - from[key]) * k;
			}
		};
	}
	loop = () => {
		const now = (performance.now() - this.t0) / 1e3;
		for (const item of [...this.items]) {
			if (item.done || now < item.at) continue;
			const k = item.dur ? Math.min(1, (now - item.at) / item.dur) : 1;
			item.run(k);
			if (k >= 1) item.done = true;
		}
		this.items = this.items.filter((i) => !i.done);
		this.redraw();
		this.raf = requestAnimationFrame(this.loop);
	};
	complete() {
		cancelAnimationFrame(this.raf);
		this.items = [];
		this.redraw();
	}
};
function textY(angle, height) {
	let top = 110 * Math.cos(Math.PI * angle / 180);
	if (Math.abs(top) < 65) top = 65 * Math.sign(top);
	return top - height / 2;
}
function textPos(size, target, viewportWidth, rotation) {
	const relativeX = 58 * -Math.sin(Math.PI * rotation / 180) - size.width / 2;
	const tx = target.x + relativeX;
	let x = relativeX;
	if (tx + size.width > viewportWidth - 10) x = viewportWidth - 10 - size.width - target.x;
	if (tx < 10) x = 10 - target.x;
	return {
		x,
		y: textY(rotation, size.height)
	};
}
function runHintAnimation(a, target, rotation, text, opts) {
	let resolveFinished = () => {};
	const finished = new Promise((r) => {
		resolveFinished = r;
	});
	let cancelled = false;
	const tl = new Timeline(() => a.all.forEach((o) => o.draw()));
	const { hand, text: tText, pointer, root, send } = a;
	const [c1, c2, c3] = a.circles;
	tText.el.style.width = "max-content";
	tText.el.innerHTML = text;
	const size = {
		width: tText.el.clientWidth,
		height: tText.el.clientHeight
	};
	const placeText = (p, r = rotation) => {
		const pos = textPos(size, p, window.innerWidth, r);
		tText.x = pos.x;
		tText.y = pos.y;
	};
	placeText(target);
	pointer.rotation = rotation;
	root.x = target.x;
	root.y = target.y;
	root.alpha = 1;
	Object.assign(hand, {
		x: -41 * DESIGN_TO_TABLE,
		y: 438 * DESIGN_TO_TABLE,
		rotation: 19,
		scaleY: .85,
		scaleX: 1.07,
		alpha: 0
	});
	for (const c of a.circles) Object.assign(c, {
		scaleX: 0,
		scaleY: 0,
		alpha: TRANSPARENT_ALPHA
	});
	Object.assign(tText, {
		scaleX: .87,
		scaleY: .87,
		alpha: 0
	});
	Object.assign(send, {
		rotation: -rotation,
		x: -13,
		y: -13,
		alpha: opts?.isSendMessage ? 1 : 0
	});
	tl.add(0, tl.tween(hand, .336, {
		x: -301 * DESIGN_TO_TABLE,
		y: 118 * DESIGN_TO_TABLE,
		rotation: 5,
		scaleY: 1.1,
		scaleX: 1,
		alpha: 1
	}));
	tl.add(.336, tl.tween(hand, .168, {
		y: 253 * DESIGN_TO_TABLE,
		rotation: 0,
		scaleY: 1,
		scaleX: 1,
		alpha: 1
	}));
	tl.add(.336, tl.tween(tText, .235, {
		scaleY: 1.05,
		scaleX: 1.05,
		alpha: 1
	}));
	tl.add(.571, tl.tween(tText, .168, {
		scaleY: 1,
		scaleX: 1
	}));
	const addClick = (ts) => {
		[
			c1,
			c2,
			c3
		].forEach((c, i) => {
			const at = ts + i * .165;
			tl.add(at, () => {
				c.alpha = 1;
				c.scaleX = 0;
				c.scaleY = 0;
			});
			tl.add(at, tl.tween(c, .6, {
				scaleX: 8.8,
				scaleY: 8.8,
				alpha: TRANSPARENT_ALPHA
			}));
		});
		tl.add(ts + .6, tl.tween(hand, .2, {
			x: -331 * DESIGN_TO_TABLE,
			y: 95 * DESIGN_TO_TABLE,
			rotation: -4,
			scaleY: .95,
			scaleX: 1.05
		}));
		tl.add(ts + .8, tl.tween(hand, .2, {
			x: -301 * DESIGN_TO_TABLE,
			y: 253 * DESIGN_TO_TABLE,
			rotation: 0,
			scaleY: 1,
			scaleX: 1
		}));
	};
	let loopTs = 1.104;
	const loop = () => {
		addClick(loopTs);
		loopTs += 1;
		tl.add(loopTs, () => {
			if (!cancelled) {
				loop();
				return;
			}
			tl.add(loopTs, tl.tween(hand, .336, {
				x: -41 * DESIGN_TO_TABLE,
				y: 438 * DESIGN_TO_TABLE,
				rotation: 0,
				scaleY: 1,
				scaleX: 1,
				alpha: TRANSPARENT_ALPHA
			}));
			tl.add(loopTs, tl.tween(tText, .235, {
				scaleY: 1,
				scaleX: 1,
				alpha: TRANSPARENT_ALPHA
			}));
			tl.add(loopTs + .336, () => {
				root.alpha = 0;
				tl.complete();
				resolveFinished();
			});
		});
	};
	loop();
	return {
		cancel: (skipEnding) => {
			cancelled = true;
			if (skipEnding) {
				root.alpha = 0;
				tl.complete();
				resolveFinished();
			}
		},
		update: (p) => {
			root.x = p.x;
			root.y = p.y;
			placeText(p);
		},
		finished
	};
}
var HINT_MASKS = {
	message: 1,
	choice: 2,
	gift: 4
};
var HINT_SCENARIOS = [
	"message",
	"choice",
	"gift"
];
var STORAGE_KEY = "bottle:interactive-hints";
var adapter = {
	read: () => {
		try {
			return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
		} catch {
			return 0;
		}
	},
	write: (v) => {
		try {
			window.localStorage.setItem(STORAGE_KEY, String(v));
		} catch {}
	}
};
var readHintFlags = () => adapter.read();
var markHintFinished = (scenario) => adapter.write((adapter.read() ?? 0) | HINT_MASKS[scenario]);
function pendingScenarios(flags) {
	if (flags === void 0) return [];
	return HINT_SCENARIOS.filter((name) => !(HINT_MASKS[name] & flags));
}
var seatLocator = null;
var setSeatLocator = (fn) => {
	seatLocator = fn;
};
var locateSeat = (seat) => seatLocator?.(seat) ?? null;
var GIFT_SENT_EVENT = "source:viewer-send-gift";
var HINT_SET_INPUT_EVENT = "source:hint-set-input";
var CHAT_SENT_EVENT = "source:chat-sent";
var PAUSE_AFTER_TABLE_CHANGE = 1e4;
var PAUSE_BETWEEN_HINTS = 15e3;
var PAUSE_AFTER_DIALOG = 500;
var MESSAGE_STEP_TIMEOUT = 15e3;
var CHOICE_STEP_TIMEOUT = 7e3;
var GIFT_STEP_TIMEOUT = 15e3;
var CONTROLS_SHOWN_THRESHOLD = 1e3;
var OSK_ANIMATION_TIME = 300;
var VIEWER_SEAT$1 = 5;
var VIEWER_MALE = true;
var isAnyDialogOpen = () => !!document.querySelector("[role=\"dialog\"]");
var giftDialog = () => document.querySelector(".send-gift");
var kissButton$1 = () => document.querySelector(".bottle-kiss-button");
var isViewerPlayingRound = () => {
	const o = document.querySelector(".bottle-play-overlay");
	return !!o && o.dataset["phase"] !== "offer" && (o.dataset["spinner"] === "5" || o.dataset["target"] === "5");
};
var hasGold = () => new URLSearchParams(window.location.search).get("hint") === "gift";
var center = (el) => {
	const r = el.getBoundingClientRect();
	return {
		x: r.left + r.width / 2,
		y: r.top + r.height / 2
	};
};
var angleForSeat = (seat) => 360 / 12 * seat + 360 / 24;
var oppositeSeat = () => {
	for (let s = 0; s < 12; s++) if (s !== VIEWER_SEAT$1 && s % 2 === 0 !== VIEWER_MALE) return s;
	return null;
};
var delay = (ms) => new Promise((r) => window.setTimeout(r, ms));
function InteractiveHints() {
	(0, import_react.useEffect)(() => {
		if (pendingScenarios(readHintFlags()).length === 0) return;
		let disposed = false, running = false;
		let next = Date.now() + PAUSE_AFTER_TABLE_CHANGE;
		const bump = (t) => {
			if (next < t) next = t;
		};
		const dialogListeners = /* @__PURE__ */ new Set();
		let dialogOpen = isAnyDialogOpen();
		let controlsShownAt = 0, controlsShown = !!kissButton$1();
		const observer = new MutationObserver(() => {
			const open = isAnyDialogOpen();
			if (open !== dialogOpen) {
				dialogOpen = open;
				bump(Date.now() + PAUSE_AFTER_DIALOG);
				dialogListeners.forEach((l) => l());
			}
			const shown = !!kissButton$1();
			if (shown && !controlsShown) controlsShownAt = Date.now();
			controlsShown = shown;
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
		const layer = document.createElement("div");
		layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:1200;font-family:Arial,Helvetica,sans-serif";
		document.body.appendChild(layer);
		const asset = createHintAsset(layer);
		const step = (timeout, setup, ignoreDialog) => new Promise((resolve, reject) => {
			let cleanup = () => {};
			const timer = window.setTimeout(() => {
				cleanup();
				reject();
			}, timeout);
			const dialog = () => {
				if (ignoreDialog?.()) return;
				cleanup();
				reject();
			};
			dialogListeners.add(dialog);
			const inner = setup((v) => {
				cleanup();
				resolve(v);
			}, () => {
				cleanup();
				reject();
			});
			cleanup = () => {
				window.clearTimeout(timer);
				dialogListeners.delete(dialog);
				inner();
			};
		});
		const follow = (update, get) => {
			const h = () => {
				const p = get();
				if (p) update(p);
			};
			window.addEventListener("resize", h);
			return () => window.removeEventListener("resize", h);
		};
		const conditions = {
			message: () => !isAnyDialogOpen() && !isViewerPlayingRound(),
			choice: () => controlsShown && Date.now() - controlsShownAt < CONTROLS_SHOWN_THRESHOLD && !isAnyDialogOpen(),
			gift: () => !isAnyDialogOpen() && !isViewerPlayingRound() && hasGold() && oppositeSeat() !== null
		};
		const message = async (t) => {
			const input = document.querySelector(".original-chat-input-field");
			const send = document.querySelector(".original-chat-send");
			if (!input || !send) return false;
			const a1 = runHintAnimation(asset, center(input), 180, t("tutorial:post:message_label"));
			const off1 = follow(a1.update, () => center(input));
			const ok = await step(MESSAGE_STEP_TIMEOUT, (resolve) => {
				const onClick = () => {
					window.dispatchEvent(new CustomEvent(HINT_SET_INPUT_EVENT, { detail: t("tutorial:post:message_text") }));
					window.setTimeout(() => input.select(), 0);
					window.setTimeout(() => {
						a1.cancel(false);
						a1.finished.then(() => resolve(true));
					}, OSK_ANIMATION_TIME);
				};
				input.addEventListener("click", onClick);
				return () => input.removeEventListener("click", onClick);
			}).catch(() => {
				a1.cancel(true);
				return false;
			});
			off1();
			if (!ok || disposed) return false;
			const a2 = runHintAnimation(asset, center(send), 135, t("tutorial:post:message_label2"));
			const off2 = follow(a2.update, () => center(send));
			const sent = await step(MESSAGE_STEP_TIMEOUT, (resolve) => {
				const onSent = () => {
					a2.cancel(false);
					a2.finished.then(() => resolve(true));
				};
				window.addEventListener(CHAT_SENT_EVENT, onSent);
				return () => window.removeEventListener(CHAT_SENT_EVENT, onSent);
			}).catch(() => {
				a2.cancel(true);
				return false;
			});
			off2();
			return sent;
		};
		const choice = async (t) => {
			if (!kissButton$1()) return false;
			const target = () => {
				const b = kissButton$1();
				if (!b) return null;
				const c = center(b);
				return {
					x: c.x,
					y: c.y - 2
				};
			};
			const a = runHintAnimation(asset, target(), 300, t("tutorial:post:kiss_label"));
			const off = follow(a.update, target);
			const result = await step(CHOICE_STEP_TIMEOUT, (resolve, reject) => {
				const onClick = (e) => {
					if (!e.target.closest(".bottle-kiss-button, .bottle-refuse-button")) return;
					a.cancel(false);
					a.finished.then(() => resolve(true));
				};
				document.addEventListener("click", onClick, true);
				const frame = window.setInterval(() => {
					if (!kissButton$1()) reject();
				}, 100);
				return () => {
					document.removeEventListener("click", onClick, true);
					window.clearInterval(frame);
				};
			}, () => !!giftDialog()).catch(() => {
				a.cancel(true);
				return false;
			});
			off();
			return result;
		};
		const gift = async (t) => {
			const seat = oppositeSeat();
			if (seat === null) return false;
			const p = locateSeat(seat);
			if (!p) return false;
			const a1 = runHintAnimation(asset, p, angleForSeat(seat), t("tutorial:post:gift_label1"));
			const off1 = follow(a1.update, () => locateSeat(seat));
			const proceed = await step(GIFT_STEP_TIMEOUT, (resolve, reject) => {
				const frame = window.setInterval(() => {
					if (!hasGold()) {
						reject();
						return;
					}
					if (giftDialog()) {
						a1.cancel(false);
						window.clearInterval(frame);
						a1.finished.then(() => resolve(true));
					} else if (isAnyDialogOpen()) reject();
				}, 50);
				return () => window.clearInterval(frame);
			}, () => true).catch(() => {
				a1.cancel(true);
				return false;
			});
			off1();
			if (!proceed || disposed) return false;
			const gem = giftDialog()?.querySelector("[data-code=\"gem\"] .send-gift__image-block");
			if (!gem) return false;
			const scroller = gem.closest(".popup__content");
			const landscape = window.innerWidth > window.innerHeight;
			await delay(10);
			gem.scrollIntoView(landscape ? { block: "nearest" } : { block: "start" });
			await delay(10);
			const a2 = runHintAnimation(asset, center(gem), landscape ? 85 : 0, t("tutorial:post:gift_label2"));
			const off2 = follow(a2.update, () => center(gem));
			const sent = await step(GIFT_STEP_TIMEOUT, (resolve, reject) => {
				let armed = false;
				const arm = window.setTimeout(() => {
					armed = true;
				}, 50);
				const onScroll = () => {
					if (armed) reject();
				};
				scroller?.addEventListener("scroll", onScroll);
				const onSent = () => {
					a2.cancel(false);
					a2.finished.then(() => resolve(true));
				};
				window.addEventListener(GIFT_SENT_EVENT, onSent);
				return () => {
					window.clearTimeout(arm);
					scroller?.removeEventListener("scroll", onScroll);
					window.removeEventListener(GIFT_SENT_EVENT, onSent);
				};
			}).catch(() => {
				a2.cancel(true);
				return false;
			});
			off2();
			return sent;
		};
		const runners = {
			message,
			choice,
			gift
		};
		const tick = window.setInterval(() => {
			if (disposed || running || Date.now() < next) return;
			const name = pendingScenarios(readHintFlags()).find((n) => conditions[n]());
			if (!name) return;
			running = true;
			loadCilizAssets().then((assets) => runners[name]((k) => translate(assets, k))).catch(() => false).finally(() => {
				markHintFinished(name);
				bump(Date.now() + PAUSE_BETWEEN_HINTS);
				running = false;
				if (pendingScenarios(readHintFlags()).length === 0) {
					disposed = true;
					window.clearInterval(tick);
				}
			});
		}, 100);
		return () => {
			disposed = true;
			window.clearInterval(tick);
			observer.disconnect();
			layer.remove();
		};
	}, []);
	return null;
}
var original_chat_emoji_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='25'%20height='25'%20viewBox='0%200%2025%2025'%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20fill='%23EDEDED'%20fill-rule='nonzero'%20d='M4.4%204.5C2.033%206.833.85%209.65.85%2012.95c0%203.3%201.183%206.133%203.55%208.5%202.333%202.333%205.15%203.5%208.45%203.5%203.3%200%206.133-1.167%208.5-3.5%202.333-2.367%203.5-5.2%203.5-8.5s-1.167-6.117-3.5-8.45c-2.367-2.367-5.2-3.55-8.5-3.55S6.733%202.133%204.4%204.5z'/%3e%3cpath%20stroke='%23B3B3B3'%20stroke-width='1.5'%20d='M4.9%2013c0-2.233.8-4.133%202.4-5.7%201.567-1.6%203.467-2.4%205.7-2.4s4.133.8%205.7%202.4c1.6%201.567%202.4%203.467%202.4%205.7s-.8%204.133-2.4%205.7c-1.567%201.6-3.467%202.4-5.7%202.4s-4.133-.8-5.7-2.4c-1.6-1.567-2.4-3.467-2.4-5.7z'/%3e%3cpath%20stroke='%23B3B3B3'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='M17.25%2014.65c-.267.9-.8%201.65-1.6%202.25-.767.6-1.65.9-2.65.9s-1.883-.3-2.65-.9c-.8-.6-1.333-1.35-1.6-2.25'/%3e%3cpath%20fill='%23B3B3B3'%20fill-rule='nonzero'%20d='M11%2011c0-.267-.1-.5-.3-.7a.96.96%200%200%200-.7-.3c-.267%200-.5.1-.7.3-.2.2-.3.433-.3.7%200%20.267.1.5.3.7.2.2.433.3.7.3.267%200%20.5-.1.7-.3.2-.2.3-.433.3-.7zM17%2011c0-.267-.1-.5-.3-.7a.96.96%200%200%200-.7-.3c-.267%200-.5.1-.7.3-.2.2-.3.433-.3.7%200%20.267.1.5.3.7.2.2.433.3.7.3.267%200%20.5-.1.7-.3.2-.2.3-.433.3-.7z'/%3e%3c/g%3e%3c/svg%3e";
var original_chat_send_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%3e%3cdefs%3e%3clinearGradient%20id='a'%20x1='154.01%25'%20x2='-58.594%25'%20y1='50%25'%20y2='50%25'%3e%3cstop%20offset='0%25'%20stop-color='%23FD9348'/%3e%3cstop%20offset='100%25'%20stop-color='%23FDC14E'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='url(%23a)'%20d='M12.05.95C8.75.95%205.933%202.133%203.6%204.5%201.233%206.833.05%209.65.05%2012.95c0%203.3%201.183%206.133%203.55%208.5%202.333%202.333%205.15%203.5%208.45%203.5%203.3%200%206.133-1.167%208.5-3.5%202.333-2.367%203.5-5.2%203.5-8.5s-1.167-6.117-3.5-8.45c-2.367-2.367-5.2-3.55-8.5-3.55z'%20transform='translate(-.05%20-.95)'/%3e%3cpath%20fill='%23FFF'%20d='M6.75%205.7a.538.538%200%200%200-.5.05.499.499%200%200%200-.2.5l.55%204.15c0%20.233.133.383.4.45L15.7%2012%207%2013.15c-.267.067-.4.217-.4.45l-.55%204.15c-.033.2.033.367.2.5.167.1.333.117.5.05l12.4-5.85c.2-.1.3-.25.3-.45s-.1-.35-.3-.45L6.75%205.7z'/%3e%3c/g%3e%3c/svg%3e";
var original_chat_gift_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='28'%20height='28'%20viewBox='0%200%2028%2028'%3e%3cdefs%3e%3clinearGradient%20id='a'%20x1='50.156%25'%20x2='50.156%25'%20y1='-5%25'%20y2='116.429%25'%3e%3cstop%20offset='0%25'%20stop-color='%23CA4345'/%3e%3cstop%20offset='100%25'%20stop-color='%23F15152'/%3e%3c/linearGradient%3e%3clinearGradient%20id='b'%20x1='50.113%25'%20x2='50.113%25'%20y1='95.804%25'%20y2='14.196%25'%3e%3cstop%20offset='0%25'%20stop-color='%23FBA163'/%3e%3cstop%20offset='63.529%25'%20stop-color='%23FCC765'/%3e%3c/linearGradient%3e%3clinearGradient%20id='c'%20x1='50.833%25'%20x2='50.833%25'%20y1='98.661%25'%20y2='17.054%25'%3e%3cstop%20offset='0%25'%20stop-color='%23CA4345'/%3e%3cstop%20offset='100%25'%20stop-color='%23F15152'/%3e%3c/linearGradient%3e%3clinearGradient%20id='d'%20x1='50%25'%20x2='50%25'%20y1='98.214%25'%20y2='3.214%25'%3e%3cstop%20offset='0%25'%20stop-color='%23FBA163'/%3e%3cstop%20offset='63.529%25'%20stop-color='%23FCC765'/%3e%3c/linearGradient%3e%3clinearGradient%20id='e'%20x1='49.587%25'%20x2='49.587%25'%20y1='98.214%25'%20y2='3.214%25'%3e%3cstop%20offset='0%25'%20stop-color='%23CA4345'/%3e%3cstop%20offset='100%25'%20stop-color='%23F15152'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20fill='none'%20fill-rule='nonzero'%3e%3cpath%20fill='%23FFF'%20d='M27.45%207.55A2.07%202.07%200%200%200%2026%207h-3.7c.5-.733.75-1.567.75-2.5%200-1.267-.433-2.333-1.3-3.2C20.917.433%2019.867%200%2018.6%200c-1.433%200-2.567.517-3.4%201.55L14.05%203.1l-1.2-1.55C12.05.517%2010.933%200%209.5%200%208.233%200%207.167.433%206.3%201.3S5%203.233%205%204.5c0%20.933.25%201.767.75%202.5H2c-.567%200-1.033.183-1.4.55-.4.4-.6.883-.6%201.45v5c0%20.567.2%201.033.6%201.4.4.4.867.6%201.4.6v10c0%20.567.2%201.033.6%201.4.4.4.867.6%201.4.6h20.05c.533%200%201-.2%201.4-.6.367-.367.55-.833.55-1.4V16c.567%200%201.05-.2%201.45-.6.367-.367.55-.833.55-1.4V9a2.07%202.07%200%200%200-.55-1.45z'/%3e%3cpath%20fill='url(%23a)'%20d='M15.05%205.95c.667-.667%201-1.483%201-2.45%200-.933-.333-1.767-1-2.5-.667-.667-1.483-1-2.45-1-1.067%200-1.933.4-2.6%201.2L8.05%203.75l-2-2.55C5.45.4%204.6%200%203.5%200c-1%200-1.817.333-2.45%201C.417%201.667.067%202.5%200%203.5c0%201%20.35%201.817%201.05%202.45C1.717%206.65%202.533%207%203.5%207h9.1c.933%200%201.75-.35%202.45-1.05M12.6%205h-3l1.95-2.55c.267-.3.617-.45%201.05-.45.433%200%20.783.133%201.05.4.3.3.45.667.45%201.1%200%20.4-.15.75-.45%201.05-.3.3-.65.45-1.05.45M4.55%202.45L6.45%205H3.5c-.433%200-.783-.15-1.05-.45C2.15%204.25%202%203.9%202%203.5c0-.433.15-.8.45-1.1.233-.267.583-.4%201.05-.4.4%200%20.75.15%201.05.45z'%20transform='translate(6%201)'/%3e%3cpath%20fill='url(%23b)'%20d='M22.05%2013L22%200H0v13c0%20.267.1.5.3.7.2.2.433.3.7.3h20.05c.267%200%20.5-.1.7-.3.2-.2.3-.433.3-.7z'%20transform='translate(3%2013)'/%3e%3cpath%20fill='url(%23c)'%20d='M6%2014V0H0l.05%2014z'%20transform='translate(11%2013)'/%3e%3cpath%20fill='url(%23d)'%20d='M26%201c0-.667-.333-1-1-1H1C.333%200%200%20.333%200%201v4.95c0%20.667.333%201%201%201L25%207c.667%200%201-.333%201-1V1z'%20transform='translate(1%208)'/%3e%3cpath%20fill='url(%23e)'%20d='M6.05%207V0H0v6.95z'%20transform='translate(11%208)'/%3e%3c/g%3e%3c/svg%3e";
var qs = (params) => Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
async function loadJSON(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Wrong response: ${res.status} ${url}`);
	return res.json();
}
var CilizMusicService = class {
	host;
	receiver;
	platform;
	id = "cz";
	musicCount = 48;
	musicPrice = 5;
	supportsMusicTabs = true;
	confirmationTitleId = "ios:dlg:music_confirm:title";
	mediaSearchCooldown = 200;
	constructor(host, receiver, platform) {
		this.host = host;
		this.receiver = receiver;
		this.platform = platform;
	}
	updateUrl(url) {
		return url.replace("http://", "https://");
	}
	parseResponse(response) {
		if (!response) return [];
		return response.filter((item) => item.url).map((item) => ({
			artist: item.artist || "",
			duration: item.duration,
			song_id: item.id,
			provider: "cz",
			title: item.title || "",
			url: this.updateUrl(item.url ?? "")
		}));
	}
	async getDefaultAudios() {
		return this.parseResponse(await loadJSON(`${this.host}/get_by_ids_and_popular?${qs({ count: this.musicCount })}`));
	}
	async search(query) {
		if (!query) return this.getDefaultAudios();
		const params = qs({
			query,
			count: this.musicCount,
			country: this.receiver.country,
			age: this.receiver.age,
			platform: this.platform
		});
		return this.parseResponse(await loadJSON(`${this.host}/search?${params}`));
	}
	getPopular() {
		return this.search("");
	}
	async getMusicByIds(ids) {
		if (!ids.length) return [];
		const songs = this.parseResponse(await loadJSON(`${this.host}/get_by_ids_and_popular?${qs({
			ids: ids.join(","),
			count: 0
		})}`));
		const byId = new Map(songs.map((s) => [s.song_id, s]));
		return ids.map((id) => byId.get(id)).filter((s) => !!s);
	}
};
var YT_BASE = "https://youtube.ciliz.com/";
var YT_PROXY = "https://api-proxy.ciliz.com/youtube/";
var useProxy = false;
async function ytRequest(method, params) {
	if (method === "get_by_ids" && "id" in params && !params["id"]) return [];
	const query = qs(params);
	const get = (proxy) => {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 1e4);
		return fetch(`${proxy ? YT_PROXY : YT_BASE}${method}?${query}`, { signal: ctrl.signal }).then((r) => {
			if (!r.ok) throw new Error(`video server ${r.status}`);
			return r.json();
		}).finally(() => clearTimeout(timer));
	};
	const proxy = useProxy;
	let result;
	try {
		result = await get(proxy);
	} catch {
		result = await get(!proxy);
		useProxy = !proxy;
	}
	return Array.isArray(result) ? result : [];
}
var item2music = (item) => ({
	artist: "",
	duration: item.duration,
	icon: item.icon,
	song_id: item.id,
	provider: "yt",
	title: item.title || "",
	url: `https://www.youtube.com/watch?v=${item.id}`
});
function social2platform(id) {
	switch (id) {
		case "as":
		case "fb":
		case "gg": return "bottle_fb";
		default: return `bottle_${id}`;
	}
}
var YTVideoService = class {
	p;
	id = "yt";
	musicPrice = 9;
	videoCount = 48;
	supportsMusicTabs = true;
	confirmationTitleId = "dlg:video:title";
	mediaSearchCooldown = 200;
	constructor(p) {
		this.p = p;
	}
	async search(query) {
		const q = query ? query.replace(/[-.,]/gi, "") : "";
		if (!q || /^[ ]*$/.test(q)) return (await ytRequest("popular", {
			count: this.videoCount,
			platform: social2platform(this.p.socialId),
			user_country: this.p.user_country
		})).map(item2music);
		return (await ytRequest("search", {
			q,
			count: this.videoCount,
			user_vip: this.p.user_vip ? "1" : "0"
		})).map(item2music);
	}
	getPopular() {
		return this.search("");
	}
	async getMusicByIds(ids) {
		if (!ids.length) return [];
		return (await ytRequest("get_by_ids", { id: ids.join(",") })).map(item2music);
	}
};
function secondsToMMSS(sec) {
	const two = (n) => n < 10 ? `0${n}` : `${n}`;
	const m = Math.floor(sec / 60);
	return `${two(m)}:${two(Math.floor(sec - m * 60))}`;
}
/** MusicFolderServiceCache: newest first, capped at the folder limit. Kept on this device. */
var MusicFolder = class {
	key;
	limit;
	songs;
	constructor(key, limit) {
		this.key = key;
		this.limit = limit;
		let saved = [];
		try {
			saved = JSON.parse(localStorage.getItem(key) || "[]");
		} catch {}
		this.songs = Array.isArray(saved) ? saved.filter((v) => typeof v === "string") : [];
	}
	mark(id, on) {
		let songs = this.songs.filter((o) => o !== id);
		if (on) songs.unshift(id);
		this.songs = songs.slice(0, this.limit);
		try {
			localStorage.setItem(this.key, JSON.stringify(this.songs));
		} catch {}
	}
	has(id) {
		return this.songs.includes(id);
	}
	get hasSpace() {
		return this.songs.length < this.limit;
	}
};
var prepare = null;
function prepareYouTube() {
	if (!prepare) prepare = new Promise((resolve) => {
		if (window.YT?.Player) return resolve();
		window.onYouTubeIframeAPIReady = () => {
			window.onYouTubeIframeAPIReady = void 0;
			resolve();
		};
		const script = document.createElement("script");
		script.src = "https://www.youtube.com/iframe_api";
		document.head.appendChild(script);
	});
	return prepare;
}
function YouTubeFrame({ videoId, preview = false, startPosition = 0, muted = false, volume = 1, onReady, onProgress, onComplete }) {
	const hostRef = (0, import_react.useRef)(null);
	const playerRef = (0, import_react.useRef)(null);
	const cb = (0, import_react.useRef)({
		onReady,
		onProgress,
		onComplete,
		muted,
		volume
	});
	cb.current = {
		onReady,
		onProgress,
		onComplete,
		muted,
		volume
	};
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		if (!host) return;
		let destroyed = false;
		let ready = false;
		let autoplayCheck;
		const resume = (event) => {
			if (event.target instanceof Element && event.target.closest(".player-controls, .music-stop-button")) return;
			const q = playerRef.current;
			if (!q || !ready || destroyed) return;
			try {
				if (q.getPlayerState() !== 1) {
					q.playVideo();
					q.seekTo(currentTimeSec(), true);
				}
				q.setVolume(Math.round(cb.current.volume * 100));
				if (cb.current.muted || cb.current.volume === 0) q.mute();
				else if (q.isMuted()) q.unMute();
			} catch {}
		};
		if (!preview) document.addEventListener("pointerdown", resume);
		const startTs = Date.now() - 1e3 * startPosition;
		const currentTimeSec = () => (Date.now() - startTs) / 1e3;
		const target = document.createElement("div");
		host.appendChild(target);
		const interval = window.setInterval(() => cb.current.onProgress?.(currentTimeSec()), 1e3);
		prepareYouTube().then(() => {
			if (destroyed || !window.YT) return;
			playerRef.current = new window.YT.Player(target, {
				width: "100%",
				height: "100%",
				videoId,
				playerVars: {
					autoplay: preview ? 0 : 1,
					enablejsapi: 1,
					disablekb: 1,
					iv_load_policy: 3,
					playsinline: 1,
					modestbranding: 1,
					rel: 0,
					showinfo: 0,
					start: Math.floor(startPosition),
					vq: preview ? "default" : "small",
					origin: window.location.origin
				},
				events: {
					onReady: () => {
						ready = true;
						const p = playerRef.current;
						if (!p || destroyed) return;
						cb.current.onReady?.();
						if (!preview) {
							p.setVolume(Math.max(0, Math.min(100, Math.round(cb.current.volume * 100))));
							if (cb.current.muted || cb.current.volume === 0) p.mute();
							else {
								p.setVolume(Math.max(0, Math.min(100, Math.round(cb.current.volume * 100))));
								p.unMute();
							}
							p.playVideo();
							p.seekTo(currentTimeSec(), true);
							autoplayCheck = window.setTimeout(() => {
								const q = playerRef.current;
								if (!q || destroyed) return;
								if (q.getPlayerState() !== 1 && q.getPlayerState() !== 3) {
									q.mute();
									q.playVideo();
									q.seekTo(currentTimeSec(), true);
								}
							}, 1500);
						}
					},
					onStateChange: (e) => {
						if (e.data === window.YT?.PlayerState["ENDED"]) cb.current.onComplete?.();
					}
				}
			});
		});
		return () => {
			destroyed = true;
			window.clearInterval(interval);
			window.clearTimeout(autoplayCheck);
			document.removeEventListener("pointerdown", resume);
			if (ready) playerRef.current?.destroy();
			playerRef.current = null;
			host.innerHTML = "";
		};
	}, [
		videoId,
		preview,
		startPosition
	]);
	(0, import_react.useEffect)(() => {
		const p = playerRef.current;
		if (!p) return;
		try {
			p.setVolume(volume * 100);
			if (muted || volume === 0) p.mute();
			else p.unMute();
		} catch {}
	}, [muted, volume]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "music__video-frame",
		style: { height: "100%" }
	});
}
var bem$4 = (block) => (element = "", mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
var listCls = bem$4("music-list");
var previewCls = bem$4("music-preview");
var audioCls = bem$4("preview-audio-player");
var TABS = [
	"hot",
	"favourites",
	"history",
	"search"
];
var SPACING = 10;
var CHUNK = 20;
/** CSSTransition('popup--center', 'popup--show', 'popup--hide'). */
function usePopupPhase(open) {
	const [mounted, setMounted] = (0, import_react.useState)(open);
	const [phase, setPhase] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open) {
			setMounted(true);
			setPhase("show");
			const id = window.setTimeout(() => setPhase(null), 300);
			return () => window.clearTimeout(id);
		}
		if (!mounted) return;
		setPhase("hide");
		const id = window.setTimeout(() => {
			setMounted(false);
			setPhase(null);
		}, 100);
		return () => window.clearTimeout(id);
	}, [open]);
	return {
		mounted,
		phase
	};
}
function PopupShell({ open, onClose, className, label, z, children }) {
	const { mounted, phase } = usePopupPhase(open);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const key = (e) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [open, onClose]);
	if (!mounted) return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: z,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: (e) => {
					e.stopPropagation();
					onClose();
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": label,
				className: [
					"popup",
					className,
					"popup--center",
					phase === "show" && "popup--show",
					phase === "hide" && "popup--hide"
				].filter(Boolean).join(" "),
				children
			})]
		})
	}), document.body);
}
var CloseButton = ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "popup__close popup__close--dlg",
	onClick: onClose,
	role: "button",
	"aria-label": "Bağla",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
});
function MusicListDialog({ open, type, assets, service, onPurchase, onClose }) {
	const t = (key) => translate(assets, key);
	const [tab, setTab] = (0, import_react.useState)("hot");
	const [query, setQuery] = (0, import_react.useState)("");
	const [songs, setSongs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [shown, setShown] = (0, import_react.useState)(CHUNK);
	const scrollRef = (0, import_react.useRef)(null);
	const requestId = (0, import_react.useRef)(0);
	const debounce = (0, import_react.useRef)(void 0);
	const folders = (0, import_react.useRef)(null);
	if (!folders.current && typeof window !== "undefined") {
		const prefix = type === "audio" ? "songs" : "videos";
		folders.current = {
			fav: new MusicFolder(`bottle-fav_${prefix}`, 50),
			history: new MusicFolder(`bottle-history_${prefix}`, 50)
		};
	}
	const update = (0, import_react.useCallback)(async (load) => {
		const id = ++requestId.current;
		setLoading(true);
		try {
			const items = await load();
			if (id !== requestId.current) return;
			const fav = folders.current?.fav;
			setSongs(items.map((music) => ({
				id: music.song_id,
				artist: music.artist,
				title: music.title,
				duration: secondsToMMSS(music.duration),
				icon: music.icon,
				favourite: !!fav?.has(music.song_id),
				music
			})));
			setShown(CHUNK);
		} catch (error) {
			console.info(error);
			if (id === requestId.current) setSongs([]);
		} finally {
			if (id === requestId.current) setLoading(false);
		}
	}, []);
	const updateTab = (0, import_react.useCallback)((next, search) => {
		const f = folders.current;
		window.clearTimeout(debounce.current);
		switch (next) {
			case "search":
				if (search.trim() === "" || type === "audio") update(() => service.search(search));
				else debounce.current = window.setTimeout(() => void update(() => service.search(search)), service.mediaSearchCooldown);
				break;
			case "hot":
				update(() => service.getPopular());
				break;
			case "favourites":
				update(() => service.getMusicByIds(f?.fav.songs ?? []));
				break;
			case "history": update(() => service.getMusicByIds(f?.history.songs ?? []));
		}
	}, [
		service,
		type,
		update
	]);
	(0, import_react.useEffect)(() => {
		if (open) updateTab(tab, query);
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = 0;
	}, [songs]);
	(0, import_react.useEffect)(() => () => window.clearTimeout(debounce.current), []);
	const onTab = (next) => {
		if (next === tab) return;
		setTab(next);
		updateTab(next, query);
	};
	const onSearch = (value) => {
		setQuery(value);
		updateTab("search", value);
	};
	const markFavourite = (song) => {
		const fav = folders.current?.fav;
		if (!fav) return;
		if (!song.favourite && !fav.hasSpace) return;
		fav.mark(song.id, !song.favourite);
		setSongs((list) => list.map((s) => s.id === song.id ? {
			...s,
			favourite: !s.favourite
		} : s));
	};
	const purchase = (music) => {
		folders.current?.history.mark(music.song_id, true);
		onPurchase(music);
	};
	const onScroll = () => {
		const el = scrollRef.current;
		if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 35) setShown((n) => Math.min(songs.length, n + CHUNK));
	};
	const titles = {
		hot: t("dlg:music:title:hot"),
		favourites: t("dlg:music:title:favourites"),
		history: t("dlg:music:title:history"),
		search: t("dlg:music:title:search")
	};
	const searchHint = type === "audio" ? t("dlg:music:search_btn") : t("dlg:video:search:hint");
	const showList = !loading && songs.length > 0;
	const visible = songs.slice(0, shown);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopupShell, {
		open,
		onClose,
		className: listCls("x_popup"),
		label: t("dlg:music:title"),
		z: 1e3,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `popup__header ${listCls("x_popup__header")}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: listCls("tabs"),
						children: TABS.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: name,
							role: "button",
							"aria-label": titles[name],
							className: `${listCls("tab")} ${listCls(`${name}-tab`, name === tab ? [] : ["inactive"])}`,
							onClick: () => onTab(name)
						}, name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: listCls("title"),
						children: titles[tab]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchControls, {
						inactive: tab !== "search",
						hint: searchHint,
						value: query,
						onInput: onSearch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseButton, { onClose })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scrollRef,
				onScroll,
				className: `popup__content ${listCls("x_popup__content")}`,
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: listCls("loading"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: listCls("loading-icon") })
					}),
					showList && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: type === "video" ? listCls("video-list") : "",
						children: type === "audio" ? visible.map((song) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: listCls("audio-item"),
							onClick: (e) => {
								e.stopPropagation();
								purchase(song.music);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: listCls("audio-desc"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: listCls("song"),
										children: song.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: listCls("artist"),
										children: song.artist
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: listCls("audio-duration"),
									children: song.duration
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `${listCls("favourite")} ${listCls("favourite--audio")} ${song.favourite ? "" : listCls("favourite--inactive")}`,
									onClick: (e) => {
										e.stopPropagation();
										markFavourite(song);
									}
								})
							]
						}, `audio-item-${song.id}`)) : visible.map((song, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: listCls("video-item"),
							style: { marginRight: idx % 2 === 0 ? SPACING : 0 },
							onClick: () => purchase(song.music),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: listCls("video-thumbnail-container"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { backgroundImage: `url('${song.icon}')` },
										className: listCls("video-thumbnail")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `${listCls("favourite")} ${listCls("favourite--video")} ${song.favourite ? "" : listCls("favourite--inactive")}`,
										onClick: (e) => {
											e.stopPropagation();
											markFavourite(song);
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: listCls("video-duration"),
										children: song.duration
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: listCls("video-desc"),
								children: song.title
							})]
						}, song.id))
					}),
					!loading && songs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: listCls("empty"),
						children: t("html:dlg:music:empty")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__footer" })
		]
	});
}
function SearchControls({ inactive, hint, value, onInput }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${listCls("search")} ${inactive ? "" : listCls("search--active")}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: listCls("search-icon") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: listCls("search-input"),
				value,
				placeholder: hint,
				"aria-label": hint,
				onChange: (e) => onInput(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${listCls("search-reset")} ${value === "" ? "" : listCls("search-reset--active")}`,
				onClick: () => onInput("")
			})
		]
	});
}
function PreviewAudioPlayer({ song }) {
	const ref = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const audio = ref.current;
		if (!audio) return;
		const onTime = () => setTime(audio.currentTime);
		const onMeta = () => setDuration(audio.duration);
		const onEnd = () => {
			setPlaying(false);
			setTime(0);
		};
		audio.addEventListener("timeupdate", onTime);
		audio.addEventListener("loadedmetadata", onMeta);
		audio.addEventListener("ended", onEnd);
		return () => {
			audio.pause();
			audio.removeEventListener("timeupdate", onTime);
			audio.removeEventListener("loadedmetadata", onMeta);
			audio.removeEventListener("ended", onEnd);
		};
	}, []);
	const toggle = () => {
		const audio = ref.current;
		if (!audio) return;
		if (playing) {
			audio.pause();
			setPlaying(false);
			return;
		}
		setPlaying(true);
		audio.play().catch(() => setPlaying(false));
	};
	const pct = duration > 0 ? time / duration * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: audioCls("", [duration > 0 ? "" : "loading"]),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref,
				src: song.url,
				preload: "metadata"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: audioCls("button", [playing ? "pause" : "play", duration > 0 ? "" : "disabled"]),
				onClick: toggle,
				role: "button",
				"aria-label": playing ? "Dayandır" : "Səsləndir"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: audioCls("slider"),
				type: "range",
				min: 0,
				max: Math.ceil(duration),
				step: 1,
				value: time,
				"aria-label": "Səsləndirmə mövqeyi",
				onChange: (e) => {
					const v = Number(e.target.value);
					if (ref.current) ref.current.currentTime = v;
					setTime(v);
				},
				style: { background: `linear-gradient(to right, #9dc93b ${pct}%, rgba(0, 0, 0, 0.08) ${pct}%)` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: audioCls("time"),
				children: time > 0 ? secondsToMMSS(time) : duration ? secondsToMMSS(duration) : ""
			})
		]
	});
}
/** jsxReplaceTags(): fills <title/> and <price/> in the translated template. */
function replaceTags(tmpl, tags) {
	return tmpl.split(/(<\w+\/>)/g).map((part, i) => {
		const m = part.match(/^<(\w+)\/>$/);
		const f = m?.[1] ? tags[m[1]] : void 0;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f ? f() : part }, i);
	});
}
function MusicPreviewDialog({ open, assets, service, music, onConfirm, onClose }) {
	const [sent, setSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) setSent(false);
	}, [open, music]);
	const t = (key) => translate(assets, key);
	const isVideo = service.id === "yt";
	const tmpl = isVideo ? t("dlg:video_preview:context2:v3") : t("ios:dlg:music_confirm:desc2:v3");
	const title = music ? isVideo ? music.title : music.artist ? `${music.artist} - ${music.title}` : music.title : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopupShell, {
		open: open && !!music,
		onClose,
		className: previewCls("x_popup"),
		label: t(service.confirmationTitleId),
		z: 1010,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__title",
					children: t(service.confirmationTitleId)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseButton, { onClose })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__content popup__content--center",
				children: [music && (isVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `${previewCls("player")} universal-player`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubeFrame, {
						videoId: music.song_id,
						preview: true
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: previewCls("audio-preview-container"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewAudioPlayer, { song: music }, music.song_id)
				})), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: previewCls("context"),
					children: replaceTags(tmpl, {
						title: () => title,
						price: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: previewCls("heart"),
							children: service.musicPrice
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popup__buttons popup__buttons--center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "button button--cancel",
					role: "button",
					onClick: onClose,
					children: t("ios:dlg:music_confirm:cancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "button button--confirm",
					role: "button",
					onClick: () => {
						if (sent || !music) return;
						setSent(true);
						onConfirm(music);
					},
					children: t("ios:dlg:music_confirm:confirm")
				})]
			})
		]
	});
}
function loadClipZoom() {
	try {
		const z = Number(localStorage.getItem("clipZoom"));
		return z === 1 || z === 2 ? z : 0;
	} catch {
		return 0;
	}
}
function nextClipZoom(z) {
	const next = z === 2 ? 0 : z === 1 ? 2 : 1;
	try {
		localStorage.setItem("clipZoom", String(next));
	} catch {}
	return next;
}
function clipZoomTitle(z) {
	return z === 1 ? "Klip 1x böyüdülüb - yenə bas: 2x" : z === 2 ? "Klip 2x böyüdülüb - bas: əvvəlki ölçü" : "Klipi böyüt";
}
var bem$3 = (block) => (element = "", mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
var cls$3 = bem$3("music");
var upCls = bem$3("universal-player");
var pcCls = bem$3("player-controls");
function backgroundImageSector(deg, bg, fg) {
	if (deg <= 180) return `linear-gradient(${90 + deg}deg, transparent 50%, ${bg} 50%),linear-gradient(90deg, ${bg} 50%, transparent 50%)`;
	return `linear-gradient(${deg - 90}deg, transparent 50%, ${fg} 50%),linear-gradient(90deg, ${bg} 50%, transparent 50%)`;
}
/** HTMLAudioPlayer: plays the catalogue url from the shared start time. */
function HtmlAudio({ url, startPosition, muted, volume, onReady, onProgress, onComplete }) {
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const cb = (0, import_react.useRef)({
		onReady,
		onProgress,
		onComplete,
		muted,
		volume
	});
	cb.current = {
		onReady,
		onProgress,
		onComplete,
		muted,
		volume
	};
	(0, import_react.useEffect)(() => {
		const a = getSharedAudio();
		if (!a) return;
		let blocked = false;
		let manuallyPaused = false;
		const applySound = () => {
			a.muted = cb.current.muted;
			a.volume = cb.current.volume;
		};
		applySound();
		if (a.src !== url) a.src = url;
		const ready = () => {
			try {
				if (startPosition > 1) a.currentTime = startPosition;
			} catch {}
			cb.current.onReady();
		};
		const time = () => cb.current.onProgress(a.currentTime);
		const ended = () => cb.current.onComplete();
		const onPlay = () => {
			blocked = false;
			setPlaying(true);
			setFailed(false);
		};
		const onPause = () => setPlaying(false);
		const onError = () => setFailed(true);
		if (a.readyState >= 1) ready();
		else a.addEventListener("loadedmetadata", ready, { once: true });
		a.addEventListener("timeupdate", time);
		a.addEventListener("ended", ended);
		a.addEventListener("play", onPlay);
		a.addEventListener("pause", onPause);
		a.addEventListener("error", onError);
		setPlaying(!a.paused);
		if (a.paused) a.play().catch(() => {
			blocked = true;
			setPlaying(false);
		});
		const resume = (event) => {
			if (event.target instanceof Element && event.target.closest(".player-controls, .music-play-toggle, .music-stop-button")) return;
			if (blocked && !manuallyPaused && a.paused && !a.ended) {
				applySound();
				a.play().catch(() => {});
			}
		};
		const pauseIntent = () => {
			manuallyPaused = true;
		};
		a.addEventListener("music:pause-intent", pauseIntent);
		document.addEventListener("pointerdown", resume, true);
		document.addEventListener("touchstart", resume, true);
		document.addEventListener("keydown", resume, true);
		return () => {
			a.pause();
			document.removeEventListener("pointerdown", resume, true);
			document.removeEventListener("touchstart", resume, true);
			document.removeEventListener("keydown", resume, true);
			a.removeEventListener("music:pause-intent", pauseIntent);
			a.removeEventListener("loadedmetadata", ready);
			a.removeEventListener("timeupdate", time);
			a.removeEventListener("ended", ended);
			a.removeEventListener("play", onPlay);
			a.removeEventListener("pause", onPause);
			a.removeEventListener("error", onError);
		};
	}, [url]);
	(0, import_react.useEffect)(() => {
		const a = getSharedAudio();
		if (a) {
			a.muted = muted;
			a.volume = volume;
		}
	}, [muted, volume]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		className: "music-play-toggle",
		"aria-label": playing ? "Musiqini fasiləyə qoy" : failed ? "Musiqini yenidən səsləndirməyə çalış" : "Musiqini səsləndir",
		title: playing ? "Fasilə ver" : "Səsləndir",
		onClick: () => {
			const audio = getSharedAudio();
			if (!audio) return;
			if (!audio.paused) {
				audio.dispatchEvent(new Event("music:pause-intent"));
				audio.pause();
			} else {
				if (failed) {
					audio.load();
					setFailed(false);
				}
				audio.muted = muted;
				audio.volume = volume;
				audio.play().catch(() => setPlaying(false));
			}
		},
		children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 18 })
	}) });
}
function MusicView({ song, muted, volume, onDj, onPlayer }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [zoom, setZoom] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setZoom(loadClipZoom());
	}, []);
	const [startPosition] = (0, import_react.useState)(() => Math.max(0, (Date.now() - song.startedAt) / 1e3));
	(0, import_react.useEffect)(() => {
		setReady(false);
		setProgress(0);
	}, [song.key]);
	const size = (typeof window === "undefined" ? 0 : window.innerWidth) > 600 ? "large" : "small";
	const position = "portrait";
	const hasVideo = song.isVideo;
	const media = hasVideo ? "video" : "audio";
	const volumeClass = "with-volume";
	const title = `${song.musicItem.artist} - ${song.musicItem.title}`;
	const deg = 360 * Math.max(0, Math.min(1, progress / (song.musicItem.duration || 1)));
	const level = Math.max(0, Math.min(7, Math.round(song.sender.musicLevel)));
	const volumePercent = volume * 100;
	const rangeValue = muted ? 0 : volumePercent;
	const muteMode = muted ? "disabled" : volume > .5 ? "high" : "low";
	const done = () => finishMusic(song.key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls$3("", [
			position,
			media,
			size,
			hasVideo && zoom ? `zoom${zoom}` : void 0
		]),
		style: {
			right: 0,
			top: 6
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "music-stop-button",
				"aria-label": "Musiqini bağla",
				title: "Bağla",
				onClick: done,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$3("top", [
					size,
					media,
					position,
					volumeClass
				]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: `${cls$3("progress", [
							ready ? void 0 : "loading",
							size,
							position,
							media
						])} p-0 border-0`,
						"aria-label": `${song.sender.name}: DJ`,
						onClick: () => onDj?.(song.sender.id),
						style: { backgroundImage: ready ? backgroundImageSector(deg, "#F4F2EF", "#B6B6B6") : "none" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cls$3("photo", [size]),
							style: { backgroundImage: `url('${song.sender.photoUrl}')` },
							title: song.sender.name
						})
					}),
					!hasVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						title,
						"aria-label": "Musiqi seç",
						onClick: onPlayer,
						className: `${cls$3("recorder", [
							`${level}`,
							size,
							position,
							media
						])} p-0 border-0`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${cls$3("player", [
							media,
							size,
							position
						])} ${upCls("")}`,
						children: hasVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: upCls("thumbnail", [ready ? "hidden" : void 0]),
							style: ready ? void 0 : { backgroundImage: `url('https://img.youtube.com/vi/${song.musicItem.song_id}/0.jpg')` }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubeFrame, {
							videoId: song.musicItem.song_id,
							startPosition,
							muted,
							volume,
							onReady: () => setReady(true),
							onProgress: setProgress,
							onComplete: done
						}, song.key)] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HtmlAudio, {
							url: song.musicItem.url,
							startPosition,
							muted,
							volume,
							onReady: () => setReady(true),
							onProgress: setProgress,
							onComplete: done
						}, song.key)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: pcCls("", [
					position,
					size,
					volumeClass
				]),
				children: [
					hasVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: pcCls("zoom", [size, zoom ? "on" : void 0]),
						"data-clip-zoom": zoom,
						title: clipZoomTitle(zoom),
						"aria-label": clipZoomTitle(zoom),
						onClick: (e) => {
							e.stopPropagation();
							setZoom(nextClipZoom(zoom));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
							size: 18,
							"aria-hidden": "true"
						}), zoom > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: pcCls("zoom-badge"),
							children: [zoom, "x"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": muted ? "Səsi aç" : "Səsi bağla",
						onClick: () => setMusicMuted(!muted),
						className: pcCls("mute", [
							position,
							size,
							volumeClass,
							muteMode,
							media
						]),
						style: {
							border: 0,
							padding: 0,
							backgroundColor: "transparent",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							backgroundSize: "contain"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						"aria-label": "Səs",
						value: rangeValue,
						onChange: (e) => setMusicVolume(Number(e.target.value) / 100),
						className: pcCls("slider", [
							size,
							void 0,
							position
						]),
						style: { background: `linear-gradient(to right, #9dc93b ${rangeValue}%, #ccc ${rangeValue}%)` }
					})
				]
			})
		]
	});
}
var customColors = {
	"919768320917": "custom-pink",
	"177270703106": "custom-red",
	"894009589914": "custom-green",
	"255676327079": "custom-purple",
	"915269141219": "custom-magenta",
	"37343099": "custom-green",
	"247216532": "custom-violet"
};
function chatNameClass(user) {
	const custom = customColors[user.id];
	if (custom) return `chat__name-color--${custom}`;
	if (user.top) return "chat__name-color--top";
	if (user.isPremium) return "chat__name-color--premium";
	if (user.male === void 0) return "chat__name-color--unknown";
	return `chat__name-color--${user.isVip ? "vip-" : ""}${user.male ? "male" : "female"}`;
}
function chatMessageIsBold(sender, receiver) {
	return Boolean(sender.isViewer || receiver?.isViewer);
}
var EMOJI_UNICODES = [
	"1f600",
	"1f62c",
	"1f601",
	"1f602",
	"1f603",
	"1f604",
	"1f605",
	"1f606",
	"1f607",
	"1f609",
	"1f60a",
	"1f642",
	"1f643",
	"263a",
	"1f60b",
	"1f60c",
	"1f60d",
	"1f618",
	"1f617",
	"1f619",
	"1f61a",
	"1f61c",
	"1f61d",
	"1f61b",
	"1f911",
	"1f913",
	"1f60e",
	"1f917",
	"1f60f",
	"1f636",
	"1f610",
	"1f611",
	"1f612",
	"1f644",
	"1f914",
	"1f633",
	"1f61e",
	"1f61f",
	"1f620",
	"1f621",
	"1f614",
	"1f615",
	"1f641",
	"2639",
	"1f623",
	"1f616",
	"1f62b",
	"1f629",
	"1f624",
	"1f62e",
	"1f631",
	"1f628",
	"1f630",
	"1f62f",
	"1f626",
	"1f627",
	"1f622",
	"1f625",
	"1f62a",
	"1f613",
	"1f62d",
	"1f635",
	"1f632",
	"1f910",
	"1f637",
	"1f912",
	"1f915",
	"1f634",
	"1f4a4",
	"1f4a9",
	"1f608",
	"1f47f",
	"1f479",
	"1f47a",
	"1f480",
	"1f47b",
	"1f47d",
	"1f916",
	"1f63a",
	"1f638",
	"1f639",
	"1f63b",
	"1f63c",
	"1f63d",
	"1f640",
	"1f63f",
	"1f63e",
	"1f64c",
	"1f44f",
	"1f44b",
	"1f44d",
	"1f44e",
	"1f44a",
	"270a",
	"270c",
	"1f44c",
	"270b",
	"1f450",
	"1f4aa",
	"1f64f",
	"261d",
	"1f446",
	"1f447",
	"1f448",
	"1f449",
	"1f595",
	"1f590",
	"1f918",
	"1f596",
	"270d",
	"1f485",
	"1f444",
	"1f445",
	"1f442",
	"1f443",
	"1f441",
	"1f440",
	"1f464",
	"1f465",
	"1f5e3",
	"1f476",
	"1f466",
	"1f467",
	"1f468",
	"1f469",
	"1f471",
	"1f474",
	"1f475",
	"1f472",
	"1f473",
	"1f46e",
	"1f477",
	"1f482",
	"1f575",
	"1f385",
	"1f47c",
	"1f478",
	"1f470",
	"1f6b6",
	"1f3c3",
	"1f483",
	"1f46f",
	"1f46b",
	"1f46c",
	"1f46d",
	"1f647",
	"1f481",
	"1f645",
	"1f646",
	"1f64b",
	"1f64e",
	"1f64d",
	"1f487",
	"1f486",
	"1f491",
	"1f469-2764-1f469",
	"1f468-2764-1f468",
	"1f48f",
	"1f469-2764-1f48b-1f469",
	"1f468-2764-1f48b-1f468",
	"1f46a",
	"1f468-1f469-1f467",
	"1f468-1f469-1f467-1f466",
	"1f468-1f469-1f466-1f466",
	"1f468-1f469-1f467-1f467",
	"1f469-1f469-1f466",
	"1f469-1f469-1f467",
	"1f469-1f469-1f467-1f466",
	"1f469-1f469-1f466-1f466",
	"1f469-1f469-1f467-1f467",
	"1f468-1f468-1f466",
	"1f468-1f468-1f467",
	"1f468-1f468-1f467-1f466",
	"1f468-1f468-1f466-1f466",
	"1f468-1f468-1f467-1f467",
	"1f45a",
	"1f455",
	"1f456",
	"1f454",
	"1f457",
	"1f459",
	"1f458",
	"1f484",
	"1f48b",
	"1f463",
	"1f460",
	"1f461",
	"1f462",
	"1f45e",
	"1f45f",
	"1f452",
	"1f3a9",
	"26d1",
	"1f393",
	"1f451",
	"1f392",
	"1f45d",
	"1f45b",
	"1f45c",
	"1f4bc",
	"1f453",
	"1f576",
	"1f48d",
	"1f302",
	"1f436",
	"1f431",
	"1f42d",
	"1f439",
	"1f430",
	"1f43b",
	"1f43c",
	"1f428",
	"1f42f",
	"1f981",
	"1f42e",
	"1f437",
	"1f43d",
	"1f438",
	"1f419",
	"1f435",
	"1f648",
	"1f649",
	"1f64a",
	"1f412",
	"1f414",
	"1f427",
	"1f426",
	"1f424",
	"1f423",
	"1f425",
	"1f43a",
	"1f417",
	"1f434",
	"1f984",
	"1f41d",
	"1f41b",
	"1f40c",
	"1f41e",
	"1f41c",
	"1f577",
	"1f982",
	"1f980",
	"1f40d",
	"1f422",
	"1f420",
	"1f41f",
	"1f421",
	"1f42c",
	"1f433",
	"1f40b",
	"1f40a",
	"1f406",
	"1f405",
	"1f403",
	"1f402",
	"1f404",
	"1f42a",
	"1f42b",
	"1f418",
	"1f410",
	"1f40f",
	"1f411",
	"1f40e",
	"1f416",
	"1f400",
	"1f401",
	"1f413",
	"1f983",
	"1f54a",
	"1f415",
	"1f429",
	"1f408",
	"1f407",
	"1f43f",
	"1f43e",
	"1f409",
	"1f432",
	"1f335",
	"1f384",
	"1f332",
	"1f333",
	"1f334",
	"1f331",
	"1f33f",
	"2618",
	"1f340",
	"1f38d",
	"1f38b",
	"1f343",
	"1f342",
	"1f341",
	"1f33e",
	"1f33a",
	"1f33b",
	"1f339",
	"1f337",
	"1f33c",
	"1f338",
	"1f490",
	"1f344",
	"1f330",
	"1f383",
	"1f41a",
	"1f578",
	"1f30e",
	"1f30d",
	"1f30f",
	"1f315",
	"1f316",
	"1f317",
	"1f318",
	"1f311",
	"1f312",
	"1f313",
	"1f314",
	"1f31a",
	"1f31d",
	"1f31b",
	"1f31c",
	"1f31e",
	"1f319",
	"2b50",
	"1f31f",
	"1f4ab",
	"2728",
	"2604",
	"2600",
	"1f324",
	"26c5",
	"1f325",
	"1f326",
	"2601",
	"1f327",
	"26c8",
	"1f329",
	"26a1",
	"1f525",
	"1f4a5",
	"2744",
	"1f328",
	"2603",
	"26c4",
	"1f32c",
	"1f4a8",
	"1f32a",
	"1f32b",
	"2602",
	"2614",
	"1f4a7",
	"1f4a6",
	"1f30a",
	"1f34f",
	"1f34e",
	"1f350",
	"1f34a",
	"1f34b",
	"1f34c",
	"1f349",
	"1f347",
	"1f353",
	"1f348",
	"1f352",
	"1f351",
	"1f34d",
	"1f345",
	"1f346",
	"1f336",
	"1f33d",
	"1f360",
	"1f36f",
	"1f35e",
	"1f9c0",
	"1f357",
	"1f356",
	"1f364",
	"1f373",
	"1f354",
	"1f35f",
	"1f32d",
	"1f355",
	"1f35d",
	"1f32e",
	"1f32f",
	"1f35c",
	"1f372",
	"1f365",
	"1f363",
	"1f371",
	"1f35b",
	"1f359",
	"1f35a",
	"1f358",
	"1f362",
	"1f361",
	"1f367",
	"1f368",
	"1f366",
	"1f370",
	"1f382",
	"1f36e",
	"1f36c",
	"1f36d",
	"1f36b",
	"1f37f",
	"1f369",
	"1f36a",
	"1f37a",
	"1f37b",
	"1f377",
	"1f378",
	"1f379",
	"1f37e",
	"1f376",
	"1f375",
	"2615",
	"1f37c",
	"1f374",
	"1f37d",
	"26bd",
	"1f3c0",
	"1f3c8",
	"26be",
	"1f3be",
	"1f3d0",
	"1f3c9",
	"1f3b1",
	"26f3",
	"1f3cc",
	"1f3d3",
	"1f3f8",
	"1f3d2",
	"1f3d1",
	"1f3cf",
	"1f3bf",
	"26f7",
	"1f3c2",
	"26f8",
	"1f3f9",
	"1f3a3",
	"1f6a3",
	"1f3ca",
	"1f3c4",
	"1f6c0",
	"26f9",
	"1f3cb",
	"1f6b4",
	"1f6b5",
	"1f3c7",
	"1f574",
	"1f3c6",
	"1f3bd",
	"1f3c5",
	"1f396",
	"1f397",
	"1f3f5",
	"1f3ab",
	"1f39f",
	"1f3ad",
	"1f3a8",
	"1f3aa",
	"1f3a4",
	"1f3a7",
	"1f3bc",
	"1f3b9",
	"1f3b7",
	"1f3ba",
	"1f3b8",
	"1f3bb",
	"1f3ac",
	"1f3ae",
	"1f47e",
	"1f3af",
	"1f3b2",
	"1f3b0",
	"1f3b3",
	"1f697",
	"1f695",
	"1f699",
	"1f68c",
	"1f68e",
	"1f3ce",
	"1f693",
	"1f691",
	"1f692",
	"1f690",
	"1f69a",
	"1f69b",
	"1f69c",
	"1f3cd",
	"1f6b2",
	"1f6a8",
	"1f694",
	"1f68d",
	"1f698",
	"1f696",
	"1f6a1",
	"1f6a0",
	"1f69f",
	"1f683",
	"1f68b",
	"1f69d",
	"1f684",
	"1f685",
	"1f688",
	"1f69e",
	"1f682",
	"1f686",
	"1f687",
	"1f68a",
	"1f689",
	"1f681",
	"1f6e9",
	"2708",
	"1f6eb",
	"1f6ec",
	"26f5",
	"1f6e5",
	"1f6a4",
	"26f4",
	"1f6f3",
	"1f680",
	"1f6f0",
	"1f4ba",
	"2693",
	"1f6a7",
	"26fd",
	"1f68f",
	"1f6a6",
	"1f6a5",
	"1f3c1",
	"1f6a2",
	"1f3a1",
	"1f3a2",
	"1f3a0",
	"1f3d7",
	"1f301",
	"1f5fc",
	"1f3ed",
	"26f2",
	"1f391",
	"26f0",
	"1f3d4",
	"1f5fb",
	"1f30b",
	"1f5fe",
	"1f3d5",
	"26fa",
	"1f3de",
	"1f6e3",
	"1f6e4",
	"1f305",
	"1f304",
	"1f3dc",
	"1f3d6",
	"1f3dd",
	"1f307",
	"1f306",
	"1f3d9",
	"1f303",
	"1f309",
	"1f30c",
	"1f320",
	"1f387",
	"1f386",
	"1f308",
	"1f3d8",
	"1f3f0",
	"1f3ef",
	"1f3df",
	"1f5fd",
	"1f3e0",
	"1f3e1",
	"1f3da",
	"1f3e2",
	"1f3ec",
	"1f3e3",
	"1f3e4",
	"1f3e5",
	"1f3e6",
	"1f3e8",
	"1f3ea",
	"1f3eb",
	"1f3e9",
	"1f492",
	"1f3db",
	"26ea",
	"1f54c",
	"1f54d",
	"1f54b",
	"26e9",
	"231a",
	"1f4f1",
	"1f4f2",
	"1f4bb",
	"2328",
	"1f5a5",
	"1f5a8",
	"1f5b1",
	"1f5b2",
	"1f579",
	"1f5dc",
	"1f4bd",
	"1f4be",
	"1f4bf",
	"1f4c0",
	"1f4fc",
	"1f4f7",
	"1f4f8",
	"1f4f9",
	"1f3a5",
	"1f4fd",
	"1f39e",
	"1f4de",
	"260e",
	"1f4df",
	"1f4e0",
	"1f4fa",
	"1f4fb",
	"1f399",
	"1f39a",
	"1f39b",
	"23f1",
	"23f2",
	"23f0",
	"1f570",
	"23f3",
	"231b",
	"1f4e1",
	"1f50b",
	"1f50c",
	"1f4a1",
	"1f526",
	"1f56f",
	"1f5d1",
	"1f6e2",
	"1f4b8",
	"1f4b5",
	"1f4b4",
	"1f4b6",
	"1f4b7",
	"1f4b0",
	"1f4b3",
	"1f48e",
	"2696",
	"1f527",
	"1f528",
	"2692",
	"1f6e0",
	"26cf",
	"1f529",
	"2699",
	"26d3",
	"1f52b",
	"1f4a3",
	"1f52a",
	"1f5e1",
	"2694",
	"1f6e1",
	"1f6ac",
	"2620",
	"26b0",
	"26b1",
	"1f3fa",
	"1f52e",
	"1f4ff",
	"1f488",
	"2697",
	"1f52d",
	"1f52c",
	"1f573",
	"1f48a",
	"1f489",
	"1f321",
	"1f3f7",
	"1f516",
	"1f6bd",
	"1f6bf",
	"1f6c1",
	"1f511",
	"1f5dd",
	"1f6cb",
	"1f6cc",
	"1f6cf",
	"1f6aa",
	"1f6ce",
	"1f5bc",
	"1f5fa",
	"26f1",
	"1f5ff",
	"1f6cd",
	"1f388",
	"1f38f",
	"1f380",
	"1f381",
	"1f38a",
	"1f389",
	"1f38e",
	"1f390",
	"1f38c",
	"1f3ee",
	"2709",
	"1f4e9",
	"1f4e8",
	"1f4e7",
	"1f48c",
	"1f4ee",
	"1f4ea",
	"1f4eb",
	"1f4ec",
	"1f4ed",
	"1f4e6",
	"1f4ef",
	"1f4e5",
	"1f4e4",
	"1f4dc",
	"1f4c3",
	"1f4d1",
	"1f4ca",
	"1f4c8",
	"1f4c9",
	"1f4c4",
	"1f4c5",
	"1f4c6",
	"1f5d3",
	"1f4c7",
	"1f5c3",
	"1f5f3",
	"1f5c4",
	"1f4cb",
	"1f5d2",
	"1f4c1",
	"1f4c2",
	"1f5c2",
	"1f5de",
	"1f4f0",
	"1f4d3",
	"1f4d5",
	"1f4d7",
	"1f4d8",
	"1f4d9",
	"1f4d4",
	"1f4d2",
	"1f4da",
	"1f4d6",
	"1f517",
	"1f4ce",
	"1f587",
	"2702",
	"1f4d0",
	"1f4cf",
	"1f4cc",
	"1f4cd",
	"1f6a9",
	"1f3f3",
	"1f3f4",
	"1f510",
	"1f512",
	"1f513",
	"1f50f",
	"1f58a",
	"1f58b",
	"2712",
	"1f4dd",
	"270f",
	"1f58d",
	"1f58c",
	"1f50d",
	"1f50e",
	"2764",
	"1f49b",
	"1f49a",
	"1f499",
	"1f49c",
	"1f494",
	"2763",
	"1f495",
	"1f49e",
	"1f493",
	"1f497",
	"1f496",
	"1f498",
	"1f49d",
	"1f49f",
	"262e",
	"271d",
	"262a",
	"1f549",
	"2638",
	"2721",
	"1f52f",
	"1f54e",
	"262f",
	"2626",
	"1f6d0",
	"26ce",
	"2648",
	"2649",
	"264a",
	"264b",
	"264c",
	"264d",
	"264e",
	"264f",
	"2650",
	"2651",
	"2652",
	"2653",
	"1f194",
	"269b",
	"1f233",
	"1f239",
	"2622",
	"2623",
	"1f4f4",
	"1f4f3",
	"1f236",
	"1f21a",
	"1f238",
	"1f23a",
	"1f237",
	"2734",
	"1f19a",
	"1f251",
	"1f4ae",
	"1f250",
	"3299",
	"3297",
	"1f234",
	"1f235",
	"1f232",
	"1f170",
	"1f171",
	"1f18e",
	"1f191",
	"1f17e",
	"1f198",
	"26d4",
	"1f4db",
	"1f6ab",
	"274c",
	"2b55",
	"1f4a2",
	"2668",
	"1f6b7",
	"1f6af",
	"1f6b3",
	"1f6b1",
	"1f51e",
	"1f4f5",
	"2757",
	"2755",
	"2753",
	"2754",
	"203c",
	"2049",
	"1f4af",
	"1f505",
	"1f506",
	"1f531",
	"269c",
	"303d",
	"26a0",
	"1f6b8",
	"1f530",
	"267b",
	"1f22f",
	"1f4b9",
	"2747",
	"2733",
	"274e",
	"2705",
	"1f4a0",
	"1f300",
	"27bf",
	"1f310",
	"24c2",
	"1f3e7",
	"1f202",
	"1f6c2",
	"1f6c3",
	"1f6c4",
	"1f6c5",
	"267f",
	"1f6ad",
	"1f6be",
	"1f17f",
	"1f6b0",
	"1f6b9",
	"1f6ba",
	"1f6bc",
	"1f6bb",
	"1f6ae",
	"1f3a6",
	"1f4f6",
	"1f201",
	"1f196",
	"1f197",
	"1f199",
	"1f192",
	"1f195",
	"1f193",
	"0030-20e3",
	"0031-20e3",
	"0032-20e3",
	"0033-20e3",
	"0034-20e3",
	"0035-20e3",
	"0036-20e3",
	"0037-20e3",
	"0038-20e3",
	"0039-20e3",
	"1f51f",
	"1f522",
	"25b6",
	"23f8",
	"23ef",
	"23f9",
	"23fa",
	"23ed",
	"23ee",
	"23e9",
	"23ea",
	"1f500",
	"1f501",
	"1f502",
	"25c0",
	"1f53c",
	"1f53d",
	"23eb",
	"23ec",
	"27a1",
	"2b05",
	"2b06",
	"2b07",
	"2197",
	"2198",
	"2199",
	"2196",
	"2195",
	"2194",
	"1f504",
	"21aa",
	"21a9",
	"2934",
	"2935",
	"0023-20e3",
	"002a-20e3",
	"2139",
	"1f524",
	"1f521",
	"1f520",
	"1f523",
	"1f3b5",
	"1f3b6",
	"3030",
	"27b0",
	"2714",
	"1f503",
	"2795",
	"2796",
	"2797",
	"2716",
	"1f4b2",
	"1f4b1",
	"00a9",
	"00ae",
	"2122",
	"1f51a",
	"1f519",
	"1f51b",
	"1f51d",
	"1f51c",
	"2611",
	"1f518",
	"26aa",
	"26ab",
	"1f534",
	"1f535",
	"1f538",
	"1f539",
	"1f536",
	"1f537",
	"1f53a",
	"25aa",
	"25ab",
	"2b1b",
	"2b1c",
	"1f53b",
	"25fc",
	"25fb",
	"25fe",
	"25fd",
	"1f532",
	"1f533",
	"1f508",
	"1f509",
	"1f50a",
	"1f507",
	"1f4e3",
	"1f4e2",
	"1f514",
	"1f515",
	"1f0cf",
	"1f004",
	"2660",
	"2663",
	"2665",
	"2666",
	"1f3b4",
	"1f4ad",
	"1f5ef",
	"1f4ac",
	"1f550",
	"1f551",
	"1f552",
	"1f553",
	"1f554",
	"1f555",
	"1f556",
	"1f557",
	"1f558",
	"1f559",
	"1f55a",
	"1f55b",
	"1f55c",
	"1f55d",
	"1f55e",
	"1f55f",
	"1f560",
	"1f561",
	"1f562",
	"1f563",
	"1f564",
	"1f565",
	"1f566",
	"1f567",
	"1f441-1f5e8",
	"1f1e6-1f1e8",
	"1f1e6-1f1eb",
	"1f1e6-1f1f1",
	"1f1e9-1f1ff",
	"1f1e6-1f1e9",
	"1f1e6-1f1f4",
	"1f1e6-1f1ee",
	"1f1e6-1f1ec",
	"1f1e6-1f1f7",
	"1f1e6-1f1f2",
	"1f1e6-1f1fc",
	"1f1e6-1f1fa",
	"1f1e6-1f1f9",
	"1f1e6-1f1ff",
	"1f1e7-1f1f8",
	"1f1e7-1f1ed",
	"1f1e7-1f1e9",
	"1f1e7-1f1e7",
	"1f1e7-1f1fe",
	"1f1e7-1f1ea",
	"1f1e7-1f1ff",
	"1f1e7-1f1ef",
	"1f1e7-1f1f2",
	"1f1e7-1f1f9",
	"1f1e7-1f1f4",
	"1f1e7-1f1e6",
	"1f1e7-1f1fc",
	"1f1e7-1f1f7",
	"1f1e7-1f1f3",
	"1f1e7-1f1ec",
	"1f1e7-1f1eb",
	"1f1e7-1f1ee",
	"1f1e8-1f1fb",
	"1f1f0-1f1ed",
	"1f1e8-1f1f2",
	"1f1e8-1f1e6",
	"1f1f0-1f1fe",
	"1f1e8-1f1eb",
	"1f1f9-1f1e9",
	"1f1e8-1f1f1",
	"1f1e8-1f1f3",
	"1f1e8-1f1f4",
	"1f1f0-1f1f2",
	"1f1e8-1f1ec",
	"1f1e8-1f1e9",
	"1f1e8-1f1f7",
	"1f1ed-1f1f7",
	"1f1e8-1f1fa",
	"1f1e8-1f1fe",
	"1f1e8-1f1ff",
	"1f1e9-1f1f0",
	"1f1e9-1f1ef",
	"1f1e9-1f1f2",
	"1f1e9-1f1f4",
	"1f1ea-1f1e8",
	"1f1ea-1f1ec",
	"1f1f8-1f1fb",
	"1f1ec-1f1f6",
	"1f1ea-1f1f7",
	"1f1ea-1f1ea",
	"1f1ea-1f1f9",
	"1f1eb-1f1f0",
	"1f1eb-1f1f4",
	"1f1eb-1f1ef",
	"1f1eb-1f1ee",
	"1f1eb-1f1f7",
	"1f1f5-1f1eb",
	"1f1ec-1f1e6",
	"1f1ec-1f1f2",
	"1f1ec-1f1ea",
	"1f1e9-1f1ea",
	"1f1ec-1f1ed",
	"1f1ec-1f1ee",
	"1f1ec-1f1f7",
	"1f1ec-1f1f1",
	"1f1ec-1f1e9",
	"1f1ec-1f1fa",
	"1f1ec-1f1f9",
	"1f1ec-1f1f3",
	"1f1ec-1f1fc",
	"1f1ec-1f1fe",
	"1f1ed-1f1f9",
	"1f1ed-1f1f3",
	"1f1ed-1f1f0",
	"1f1ed-1f1fa",
	"1f1ee-1f1f8",
	"1f1ee-1f1f3",
	"1f1ee-1f1e9",
	"1f1ee-1f1f7",
	"1f1ee-1f1f6",
	"1f1ee-1f1ea",
	"1f1ee-1f1f1",
	"1f1ee-1f1f9",
	"1f1e8-1f1ee",
	"1f1ef-1f1f2",
	"1f1ef-1f1f5",
	"1f1ef-1f1ea",
	"1f1ef-1f1f4",
	"1f1f0-1f1ff",
	"1f1f0-1f1ea",
	"1f1f0-1f1ee",
	"1f1fd-1f1f0",
	"1f1f0-1f1fc",
	"1f1f0-1f1ec",
	"1f1f1-1f1e6",
	"1f1f1-1f1fb",
	"1f1f1-1f1e7",
	"1f1f1-1f1f8",
	"1f1f1-1f1f7",
	"1f1f1-1f1fe",
	"1f1f1-1f1ee",
	"1f1f1-1f1f9",
	"1f1f1-1f1fa",
	"1f1f2-1f1f4",
	"1f1f2-1f1f0",
	"1f1f2-1f1ec",
	"1f1f2-1f1fc",
	"1f1f2-1f1fe",
	"1f1f2-1f1fb",
	"1f1f2-1f1f1",
	"1f1f2-1f1f9",
	"1f1f2-1f1ed",
	"1f1f2-1f1f7",
	"1f1f2-1f1fa",
	"1f1f2-1f1fd",
	"1f1eb-1f1f2",
	"1f1f2-1f1e9",
	"1f1f2-1f1e8",
	"1f1f2-1f1f3",
	"1f1f2-1f1ea",
	"1f1f2-1f1f8",
	"1f1f2-1f1e6",
	"1f1f2-1f1ff",
	"1f1f2-1f1f2",
	"1f1f3-1f1e6",
	"1f1f3-1f1f7",
	"1f1f3-1f1f5",
	"1f1f3-1f1f1",
	"1f1f3-1f1e8",
	"1f1f3-1f1ff",
	"1f1f3-1f1ee",
	"1f1f3-1f1ea",
	"1f1f3-1f1ec",
	"1f1f3-1f1fa",
	"1f1f0-1f1f5",
	"1f1f3-1f1f4",
	"1f1f4-1f1f2",
	"1f1f5-1f1f0",
	"1f1f5-1f1fc",
	"1f1f5-1f1f8",
	"1f1f5-1f1e6",
	"1f1f5-1f1ec",
	"1f1f5-1f1fe",
	"1f1f5-1f1ea",
	"1f1f5-1f1ed",
	"1f1f5-1f1f1",
	"1f1f5-1f1f9",
	"1f1f5-1f1f7",
	"1f1f6-1f1e6",
	"1f1f7-1f1f4",
	"1f1f7-1f1fa",
	"1f1f7-1f1fc",
	"1f1f8-1f1ed",
	"1f1f0-1f1f3",
	"1f1f1-1f1e8",
	"1f1fb-1f1e8",
	"1f1fc-1f1f8",
	"1f1f8-1f1f2",
	"1f1f8-1f1f9",
	"1f1f8-1f1e6",
	"1f1f8-1f1f3",
	"1f1f7-1f1f8",
	"1f1f8-1f1e8",
	"1f1f8-1f1f1",
	"1f1f8-1f1ec",
	"1f1f8-1f1f0",
	"1f1f8-1f1ee",
	"1f1f8-1f1e7",
	"1f1f8-1f1f4",
	"1f1ff-1f1e6",
	"1f1f0-1f1f7",
	"1f1ea-1f1f8",
	"1f1f1-1f1f0",
	"1f1f8-1f1e9",
	"1f1f8-1f1f7",
	"1f1f8-1f1ff",
	"1f1f8-1f1ea",
	"1f1e8-1f1ed",
	"1f1f8-1f1fe",
	"1f1f9-1f1fc",
	"1f1f9-1f1ef",
	"1f1f9-1f1ff",
	"1f1f9-1f1ed",
	"1f1f9-1f1f1",
	"1f1f9-1f1ec",
	"1f1f9-1f1f4",
	"1f1f9-1f1f9",
	"1f1f9-1f1f3",
	"1f1f9-1f1f7",
	"1f1f9-1f1f2",
	"1f1f9-1f1fb",
	"1f1fa-1f1ec",
	"1f1fa-1f1e6",
	"1f1e6-1f1ea",
	"1f1ec-1f1e7",
	"1f1fa-1f1f8",
	"1f1fb-1f1ee",
	"1f1fa-1f1fe",
	"1f1fa-1f1ff",
	"1f1fb-1f1fa",
	"1f1fb-1f1e6",
	"1f1fb-1f1ea",
	"1f1fb-1f1f3",
	"1f1fc-1f1eb",
	"1f1ea-1f1ed",
	"1f1fe-1f1ea",
	"1f1ff-1f1f2",
	"1f1ff-1f1fc",
	"1f1f7-1f1ea",
	"1f1e6-1f1fd",
	"1f1f9-1f1e6",
	"1f1ee-1f1f4",
	"1f1e7-1f1f6",
	"1f1e8-1f1fd",
	"1f1e8-1f1e8",
	"1f1ec-1f1ec",
	"1f1ee-1f1f2",
	"1f1fe-1f1f9",
	"1f1f3-1f1eb",
	"1f1f5-1f1f3",
	"1f1e7-1f1f1",
	"1f1f5-1f1f2",
	"1f1ec-1f1f8",
	"1f1f9-1f1f0",
	"1f1e7-1f1fb",
	"1f1ed-1f1f2",
	"1f1f8-1f1ef",
	"1f1fa-1f1f2",
	"1f1ee-1f1e8",
	"1f1ea-1f1e6",
	"1f1e8-1f1f5",
	"1f1e9-1f1ec",
	"1f1e6-1f1f8",
	"1f1e6-1f1f6",
	"1f1fb-1f1ec",
	"1f1e8-1f1f0",
	"1f1e8-1f1fc",
	"1f1ea-1f1fa",
	"1f1ec-1f1eb",
	"1f1f9-1f1eb",
	"1f1ec-1f1f5",
	"1f1f2-1f1f6",
	"1f1f2-1f1f5",
	"1f1f8-1f1fd",
	"1f1f8-1f1f8",
	"1f1f9-1f1e8",
	"1f1f2-1f1eb",
	"1f5e8",
	"23cf",
	"1f3f3-1f308",
	"1f920",
	"1f921",
	"1f922",
	"1f923",
	"1f924",
	"1f925",
	"1f927",
	"1f934",
	"1f935",
	"1f936",
	"1f926",
	"1f937",
	"1f930",
	"1f933",
	"1f57a",
	"1f919",
	"1f91a",
	"1f91b",
	"1f91c",
	"1f91d",
	"1f91e",
	"1f5a4",
	"1f985",
	"1f986",
	"1f987",
	"1f988",
	"1f989",
	"1f98a",
	"1f98b",
	"1f98c",
	"1f98d",
	"1f98e",
	"1f98f",
	"1f940",
	"1f950",
	"1f951",
	"1f952",
	"1f953",
	"1f954",
	"1f955",
	"1f956",
	"1f957",
	"1f958",
	"1f959",
	"1f942",
	"1f943",
	"1f944",
	"1f6d1",
	"1f6d2",
	"1f6f4",
	"1f6f5",
	"1f6f6",
	"1f938",
	"1f939",
	"1f93c",
	"1f94a",
	"1f94b",
	"1f93d",
	"1f93e",
	"1f945",
	"1f93a",
	"1f947",
	"1f948",
	"1f949",
	"1f941",
	"1f990",
	"1f991",
	"1f95a",
	"1f95b",
	"1f95c",
	"1f95d",
	"1f95e",
	"1f1ff",
	"1f1fe",
	"1f1fd",
	"1f1fc",
	"1f1fb",
	"1f1fa",
	"1f1f9",
	"1f1f8",
	"1f1f7",
	"1f1f6",
	"1f1f5",
	"1f1f4",
	"1f1f3",
	"1f1f2",
	"1f1f1",
	"1f1f0",
	"1f1ef",
	"1f1ee",
	"1f1ed",
	"1f1ec",
	"1f1eb",
	"1f1ea",
	"1f1e9",
	"1f1e8",
	"1f1e7",
	"1f1e6"
];
var EMOJI_IMAGE_BASE = "https://butilochka.cdnvideo.ru/club/emoji/";
function hexcodeToString(code) {
	if (code <= 65535) return String.fromCharCode(code);
	const h = Math.floor((code - 65536) / 1024) + 55296;
	const l = (code - 65536) % 1024 + 56320;
	return String.fromCharCode(h, l);
}
var stringFromCodepoint = (codePoint) => codePoint.split("-").map((v) => hexcodeToString(parseInt(v, 16))).join("‍");
var EMOJI_RE = (() => {
	try {
		return new RegExp("(\\p{RGI_Emoji})+", "v");
	} catch {
		return /(\p{Extended_Pictographic})+/u;
	}
})();
var containsEmoji = (text) => EMOJI_RE.test(text);
/** measureEmojiPicker: square, 90% of the chat width, capped at 20 rows of 28px. */
var emojiPickerSize = (chatWidth) => Math.min(chatWidth * .9, 560);
/** addEmojiToInput: replace the selection and return the new caret position. */
function insertEmoji(text, selStart, selEnd, emoji) {
	return {
		text: text.slice(0, selStart) + emoji + text.slice(selEnd),
		caret: selStart + emoji.length
	};
}
/** chatPresenter.onsend: non-VIP messages containing emoji open EmojiPresenter.showWarning(onSkip). */
var emojiSendDecision = (text, vip) => !vip && containsEmoji(text) ? "warn" : "send";
var Item = (0, import_react.memo)(function Item({ code, onPick }) {
	const emoji = stringFromCodepoint(code);
	const [failed, setFailed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "emoji-picker emoji-picker__item",
		onClick: () => onPick(emoji),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: `emoji-picker emoji-picker__item--image${failed ? " emoji-picker__item--alt" : ""}`,
			alt: emoji,
			src: `${EMOJI_IMAGE_BASE}${code}.png`,
			loading: "lazy",
			onError: () => setFailed(true)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `emoji-picker emoji-picker__item--txt${failed ? "" : " emoji-picker__item--alt"}`,
			children: emoji
		})]
	});
});
function EmojiPicker({ size, vip, lockText, activateText, onPick, onBecomeVip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "emoji-picker emoji-picker__body",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "emoji-picker emoji-picker__body-layer emoji-picker__list",
			children: EMOJI_UNICODES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
				code,
				onPick
			}, code))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `emoji-picker emoji-picker__body-layer emoji-picker__vip-shade${vip ? " emoji-picker__vip-shade-hidden" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "emoji-picker emoji-picker__vip-lock" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "emoji-picker emoji-picker__vip-lock-text",
					children: lockText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "emoji-picker button button--confirm button--no-width",
					role: "button",
					onClick: onBecomeVip,
					children: activateText
				})
			]
		})]
	});
}
var VIP_TEASER_DELAY = 3e5;
var OPEN_GIFT_FOR_SEAT_EVENT = "source:open-gift-for-seat";
/** gold > 0 → newcomerGift (chat:newcomer:gift), otherwise newcomerChat (chat:newcomer:message). */
var newcomerKind = (gold) => gold > 0 ? "gift" : "chat";
var newcomerKey = (kind) => kind === "gift" ? "chat:newcomer:gift" : "chat:newcomer:message";
/** translateCustom with one '%' argument: raw text parts around the bold user name. */
function widgetParts(template, user) {
	const parts = [];
	template.split("%").forEach((raw, i) => {
		if (i > 0) parts.push({ user });
		if (raw) parts.push({ text: raw });
	});
	return parts;
}
/** scheduleWidgetOfTheDay: without rewarded video the widget is always the VIP teaser. */
function widgetOfTheDay(viewerId, day, hasRewardedVideo) {
	if (!hasRewardedVideo) return "vip";
	return (parseInt(viewerId, 10) + day) % 2 ? "vip" : "video";
}
var shouldScheduleVipTeaser = (vip, allowVipPromo) => !vip && allowVipPromo;
var Input = objectType({
	text: stringType().trim().min(1).max(500),
	lang: stringType().regex(/^[a-z]{2}$/)
});
/** Server side of session.translateText({type:'translate', text, lang}) → {ttext}. */
var translateChatText = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("e3720b803d76323a1aa360ad833c944df811f5d110048d30c412991dc775fa2c"));
var eqLocale = (a, b) => a.slice(0, 2).toLowerCase() === b.slice(0, 2).toLowerCase();
var WORDS = {
	tr: [
		"ve",
		"bir",
		"bu",
		"ne",
		"nasılsın",
		"merhaba",
		"selam",
		"evet",
		"hayır",
		"ben",
		"sen",
		"çok",
		"değil",
		"için",
		"gibi",
		"var",
		"yok",
		"naber",
		"iyi",
		"tamam"
	],
	az: [
		"və",
		"salam",
		"necəsən",
		"mən",
		"sən",
		"yaxşı",
		"bəli",
		"xeyr",
		"çox",
		"deyil",
		"üçün",
		"nə",
		"harda",
		"bu",
		"var",
		"yox"
	],
	en: [
		"the",
		"and",
		"you",
		"are",
		"is",
		"what",
		"hello",
		"hi",
		"how",
		"i",
		"my",
		"your",
		"this",
		"that",
		"yes",
		"no",
		"love",
		"with",
		"for",
		"not"
	],
	de: [
		"und",
		"ich",
		"du",
		"nicht",
		"das",
		"ist",
		"wie",
		"hallo",
		"ja",
		"nein",
		"mit",
		"der",
		"die"
	],
	es: [
		"hola",
		"que",
		"como",
		"estas",
		"el",
		"la",
		"y",
		"si",
		"no",
		"por",
		"para",
		"muy",
		"bien"
	]
};
/** Language of a chat message (stand-in for the bundled `detect(text)`); undefined when unsure. */
function detectLocale(text) {
	if (/[\u0400-\u04FF]/.test(text)) return /[іїєґ]/i.test(text) ? "uk" : "ru";
	if (/[\u0600-\u06FF]/.test(text)) return "ar";
	if (/[\u0590-\u05FF]/.test(text)) return "he";
	if (/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(text)) return "zh";
	if (/[əƏ]/.test(text)) return "az";
	if (/[ğĞıİşŞ]/.test(text)) return "tr";
	if (/[ñ¿¡]/.test(text)) return "es";
	if (/[ß]/.test(text)) return "de";
	const words = text.toLowerCase().match(/[a-zçöüğışə]+/g) ?? [];
	if (words.length === 0) return void 0;
	let best, score = 0;
	for (const [lang, list] of Object.entries(WORDS)) {
		const s = words.filter((w) => list.includes(w)).length;
		if (s > score) {
			best = lang;
			score = s;
		}
	}
	return best;
}
/** ChatPresenter.needsTranslation: other players only; sender locale or detected text language differs from the viewer's. */
function needsTranslation(sender, viewerLocale, text = "") {
	if (sender.isViewer || !viewerLocale) return false;
	if (!text.trim()) return false;
	const found = detectLocale(text);
	if (!sender.locale) return !found || !eqLocale(found, viewerLocale);
	const detected = found ?? viewerLocale;
	return !eqLocale(sender.locale, viewerLocale) || !eqLocale(detected, viewerLocale);
}
var translator = null;
function chatTranslator() {
	return translator;
}
var state = {};
var listeners = /* @__PURE__ */ new Set();
var set = (key, entry) => {
	state = {
		...state,
		[key]: entry
	};
	listeners.forEach((l) => l());
};
function toggleTranslation(key) {
	const e = state[key];
	if (e?.translated) set(key, {
		...e,
		shown: !e.shown
	});
}
function applyTranslation(key, text) {
	set(key, {
		translated: ` ${text}`,
		shown: true
	});
}
function useChatTranslations() {
	return (0, import_react.useSyncExternalStore)((l) => {
		listeners.add(l);
		return () => {
			listeners.delete(l);
		};
	}, () => state, () => state);
}
/** Message identity survives departures, but never bypasses send eligibility. */
function roomProfileResolver(current, load) {
	const cached = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Map();
	return {
		remember: (profiles) => {
			for (const p of profiles) if (p) cached.set(p.id, p);
		},
		find: (id) => {
			if (!id) return Promise.resolve(null);
			const hit = current(id) ?? cached.get(id);
			if (hit) return Promise.resolve(hit);
			const existing = pending.get(id);
			if (existing) return existing;
			const job = load(id).then((p) => {
				if (p) cached.set(p.id, p);
				return p;
			}).catch(() => null).finally(() => pending.delete(id));
			pending.set(id, job);
			return job;
		}
	};
}
var giftIcon = { url: original_chat_gift_default };
var VIEWER_LOCALE = "tr";
var VIEWER_COUNTRY = "TR";
var profileUser = (p) => ({
	id: p.id,
	name: p.name,
	photoUrl: playerPhoto(p.photo_url, p.telegram_id),
	male: p.male,
	isVip: Boolean(p.vip_until && Date.parse(p.vip_until) > Date.now()),
	...p.stone ? { stone: p.stone } : {}
});
/** Original chat area: MediaPanel (video, music), chat body with info lines, input at bottom (source order). */
function OriginalChatPanel() {
	const preferences = useChatPreferences();
	(0, import_react.useEffect)(() => {
		preloadChatAlert();
	}, []);
	const assets = useCilizAssets();
	const session = useMusicSession();
	const blocked = useBlockedUsers();
	const translations = useChatTranslations();
	const decor = useDecorState();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [reportMessage, setReportMessage] = (0, import_react.useState)(null);
	const [menuBusy, setMenuBusy] = (0, import_react.useState)(false);
	const longTap = (0, import_react.useRef)(void 0);
	const cancelLongTap = () => {
		clearTimeout(longTap.current);
		longTap.current = void 0;
	};
	(0, import_react.useEffect)(() => () => clearTimeout(longTap.current), []);
	(0, import_react.useEffect)(() => {
		setSelected(null);
		setReportMessage(null);
	}, [session.lines.length === 0]);
	const isAdmin = useIsChatAdmin();
	const selectMessage = (line) => {
		cancelLongTap();
		if (!line.sender.isViewer || isAdmin && line.messageId !== void 0) setSelected(line);
	};
	const onTranslate = (key, original) => {
		if (translations[key]?.translated) {
			toggleTranslation(key);
			return;
		}
		(chatTranslator() ?? ((t) => translateChatText({ data: {
			text: t,
			lang: VIEWER_LOCALE
		} }).then((r) => r.ttext)))(original, key).then((t) => applyTranslation(key, t), () => showSourceToast("Tərcümə alınmadı."));
	};
	const [listType, setListType] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const [text, setText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const set = (e) => {
			setReceiver(void 0);
			setText(e.detail);
		};
		window.addEventListener(HINT_SET_INPUT_EVENT, set);
		return () => window.removeEventListener(HINT_SET_INPUT_EVENT, set);
	}, []);
	const [receiver, setReceiver] = (0, import_react.useState)();
	const [small, setSmall] = (0, import_react.useState)(false);
	const { vip } = useViewerProgress();
	(0, import_react.useEffect)(() => {
		const reply = (e) => {
			setReceiver(e.detail);
			inputRef.current?.focus();
		};
		const music = (e) => setListType(e.detail?.type === "video" ? "video" : "audio");
		window.addEventListener("game-reply-to", reply);
		window.addEventListener("source:open-music-list", music);
		return () => {
			window.removeEventListener("game-reply-to", reply);
			window.removeEventListener("source:open-music-list", music);
		};
	}, []);
	const sectionRef = (0, import_react.useRef)(null);
	const [emojiOpen, setEmojiOpen] = (0, import_react.useState)(false);
	const [emojiSize, setEmojiSize] = (0, import_react.useState)(0);
	const [emojiWarning, setEmojiWarning] = (0, import_react.useState)(null);
	const openVip = () => window.dispatchEvent(new Event(OPEN_VIP_EVENT));
	(0, import_react.useEffect)(() => {
		if (!assets || widgetOfTheDay("0", (/* @__PURE__ */ new Date()).getDate(), false) !== "vip" || !shouldScheduleVipTeaser(vip, true)) return;
		const delay = new URLSearchParams(window.location.search).get("teaser") === "now" ? 3e3 : VIP_TEASER_DELAY;
		const timer = window.setTimeout(() => pushActionLine({
			style: "vip",
			icon: "vip",
			parts: [{ text: translate(assets, "chat:vip:desc") }]
		}), delay);
		return () => window.clearTimeout(timer);
	}, [assets, vip]);
	(0, import_react.useEffect)(() => {
		if (!emojiOpen) return;
		const close = (e) => {
			const t = e.target;
			if (t instanceof HTMLElement && (t.closest(".emoji-picker") || t.closest(".js-emoji"))) return;
			setEmojiOpen(false);
		};
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [emojiOpen]);
	const toggleEmoji = () => {
		setEmojiSize(emojiPickerSize(sectionRef.current?.clientWidth ?? 0));
		setEmojiOpen((o) => !o);
	};
	const pickEmoji = (emoji) => {
		const input = inputRef.current;
		const prefix = receiver ? `${receiver.name}, ` : "";
		const start = Math.max(0, (input?.selectionStart ?? prefix.length + text.length) - prefix.length);
		const end = Math.max(0, (input?.selectionEnd ?? prefix.length + text.length) - prefix.length);
		const next = insertEmoji(text, start, end, emoji);
		setText(next.text);
		window.setTimeout(() => {
			input?.focus();
			input?.setSelectionRange(prefix.length + next.caret, prefix.length + next.caret);
		}, 0);
	};
	const doSend = (value) => {
		if (!value.trim()) return;
		const to = receiver;
		if (to?.id && displaySeatOf(to.id) < 0) {
			if (assets) showSourceToast(translate(assets, "warning:offline_chat:desc"));
			return;
		}
		setText("");
		setReceiver(void 0);
		inputRef.current?.focus();
		followEnd();
		sendChat(value, to?.id, Boolean(to?.private)).then((ok) => {
			if (ok) {
				followEnd();
				window.dispatchEvent(new CustomEvent(CHAT_SENT_EVENT, { detail: value }));
			} else showSourceToast("Mesaj göndərilmədi.");
		});
	};
	(0, import_react.useEffect)(() => onRoomChatDelete((id) => removeTextLine(id)), []);
	const room = useRoom();
	(0, import_react.useEffect)(() => {
		const sb = getSupabase(), viewerId = VIEWER$1.id;
		if (!sb || !viewerId || !room.roomId) return;
		const channel = sb.channel(`table-direct-alert:${viewerId}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "direct_messages",
			filter: `recipient_id=eq.${viewerId}`
		}, (event) => {
			const m = event.new;
			playChatAlert(`direct:${m.id}`, m.sender_id, m.recipient_id, viewerId);
		}).subscribe();
		return () => {
			sb.removeChannel(channel);
		};
	}, [room.roomId]);
	const resolver = (0, import_react.useMemo)(() => roomProfileResolver((id) => {
		const seat = displaySeatOf(id);
		return seat >= 0 ? profileBySeat(seat) : null;
	}, async (id) => {
		const sb = getSupabase();
		if (!sb) return null;
		const { data } = await sb.from("profiles").select("*").eq("id", id).maybeSingle();
		return data;
	}), [room.roomId]);
	(0, import_react.useEffect)(() => resolver.remember(room.players), [resolver, room.players]);
	const receiveChatRow = (row, sender, rec) => {
		const user = {
			...profileUser(sender),
			...sender.id === VIEWER$1.id ? { isViewer: true } : {}
		};
		if (row.kind === "music") pushMusicHistoryLine({
			...user,
			musicLevel: 0
		}, row.payload?.artist ?? "", row.payload?.title ?? row.text, row.id, row.payload?.key);
		else if (row.kind === "bottle") {
			if (!assets) return;
			const bottleView = (t) => {
				const b = t ? assets.bottles?.[t] : void 0;
				const name = t ? assets.translation[`bottle:${t}`] ?? t : "standart";
				return {
					image: b ? dialogImage(assets, b.image, 30, 30).src : "",
					name
				};
			};
			const oldB = bottleView(row.payload?.old), newB = bottleView(row.payload?.new);
			pushBottleLine(user, oldB.image, oldB.name, newB.image, newB.name, row.id);
		} else if (row.kind === "newcomer" || row.kind === "birthday") {
			if (!assets || sender.id === VIEWER$1.id) return;
			if (row.kind === "newcomer" && (sender.male === VIEWER$1.male || !sender.photo_url)) return;
			const icon = row.kind === "birthday" ? "gift" : newcomerKind(profileBySeat(5)?.gold ?? 0);
			pushActionLine({
				style: row.kind,
				icon,
				sender: user,
				parts: widgetParts(assets.translation[row.kind === "birthday" ? "chat:birthday" : newcomerKey(icon)] ?? "%", user),
				messageId: row.id
			});
		} else if (row.kind && row.kind !== "chat") pushSystemLine(row.kind, row.text, row.id);
		else pushTextLine(user, row.text, rec ? profileUser(rec) : void 0, row.id, Boolean(row.is_private));
		stampChatHistory(row.id, row.created_at);
	};
	const receiveRef = (0, import_react.useRef)(receiveChatRow);
	receiveRef.current = receiveChatRow;
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => expireChatHistory(), 15e3);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		let alive = true;
		let queue = Promise.resolve();
		const off = onRoomChat((row) => {
			const participants = Promise.all([resolver.find(row.user_id), resolver.find(row.receiver_id)]);
			queue = queue.then(async () => {
				const [sender, rec] = await participants;
				await new Promise((resolve) => window.setTimeout(resolve, 0));
				if (alive && sender) {
					receiveRef.current(row, sender, rec);
					if ((!row.kind || row.kind === "chat") && !blocked.has(row.user_id)) playChatAlert(`room:${row.id}`, row.user_id, row.receiver_id, VIEWER$1.id);
				}
			});
		});
		return () => {
			alive = false;
			off();
		};
	}, [resolver]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const off = onRoomKickout((ev) => {
			Promise.all([resolver.find(ev.actor_id), resolver.find(ev.target_id)]).then(([actor, target]) => {
				if (!alive || !target) return;
				const u = (p) => ({
					...profileUser(p),
					...p.id === VIEWER$1.id ? { isViewer: true } : {}
				});
				pushKickoutLine(ev.kind, u(actor ?? target), u(target), ev.id);
			});
		});
		return () => {
			alive = false;
			off();
		};
	}, [resolver]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const off = onRoomHarem((ev) => {
			if (!assets) return;
			const find = async (id) => {
				if (!id) return null;
				const seat = displaySeatOf(id);
				const p = seat >= 0 ? profileBySeat(seat) : null;
				if (p) return p;
				const { data } = await (getSupabase()?.from("profiles").select("*").eq("id", id).maybeSingle() ?? Promise.resolve({ data: null }));
				return data ?? null;
			};
			(async () => {
				const [target, newOwner, oldOwner] = await Promise.all([
					find(ev.targetId),
					find(ev.newOwnerId),
					find(ev.oldOwnerId)
				]);
				if (!alive || !target || !newOwner) return;
				const u = (p) => ({
					...profileUser(p),
					...p.id === VIEWER$1.id ? { isViewer: true } : {}
				});
				const icon = newOwner.id === target.id ? "harem_free" : "harem_busy";
				const seated = (p) => !!p && displaySeatOf(p.id) >= 0;
				const forText = translate(assets, "chat:harem:for:new_chat");
				if (newOwner.id === target.id && oldOwner && (seated(target) || seated(oldOwner))) pushHaremLine({
					icon,
					sender: u(target),
					receiver: u(oldOwner),
					text: `${trG("chat:harem:target:target:new_chat", target.male)} ${forText}`,
					price: ev.price
				});
				else if (!seated(newOwner) && oldOwner && seated(oldOwner) && target.id !== VIEWER$1.id && target.id !== oldOwner.id) pushHaremLine({
					icon,
					sender: u(target),
					receiver: u(oldOwner),
					text: `${trG("chat:harem:target:old:new_chat", target.male)} ${forText}`,
					price: ev.price
				});
				else pushHaremLine({
					icon,
					sender: u(newOwner),
					receiver: u(target),
					text: `${trG("chat:harem:new:target:new_chat", newOwner.male)} ${forText}`,
					price: ev.price
				});
			})();
		});
		return () => {
			alive = false;
			off();
		};
	}, [assets, room.roomId]);
	(0, import_react.useEffect)(() => {
		const el = scrollRef.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(([entry]) => {
			if (entry) setSmall(entry.contentRect.width <= 200);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const services = (0, import_react.useMemo)(() => ({
		audio: new CilizMusicService("https://music.ciliz.com/api", {
			country: VIEWER_COUNTRY,
			age: VIEWER$1.age
		}, VIEWER_STORE.social),
		video: new YTVideoService({
			socialId: "fb",
			user_country: VIEWER_COUNTRY,
			user_vip: false
		})
	}), []);
	(0, import_react.useEffect)(() => {
		registerMusicServices([services.audio, services.video]);
	}, [services]);
	const atBottom = (0, import_react.useRef)(true);
	const [showScrollBtn, setShowScrollBtn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = scrollRef.current;
		if (!el) return;
		if (atBottom.current) {
			el.scrollTop = el.scrollHeight;
			setShowScrollBtn(false);
		} else setShowScrollBtn(true);
	}, [session.lines.at(-1)?.key]);
	const onChatScroll = () => {
		const el = scrollRef.current;
		if (!el) return;
		atBottom.current = Math.ceil(el.scrollTop) >= el.scrollHeight - el.clientHeight - 2;
		if (atBottom.current) setShowScrollBtn(false);
	};
	const followEnd = () => {
		const el = scrollRef.current;
		if (el) {
			el.scrollTop = el.scrollHeight;
			atBottom.current = true;
		}
		setShowScrollBtn(false);
	};
	const roomId = useRoom().roomId;
	(0, import_react.useEffect)(() => {
		if (!roomId) return;
		let alive = true;
		loadRoomChatHistory(roomId).then((rows) => {
			if (!alive) return;
			batchChatHistory(() => {
				for (const r of rows) receiveRef.current(r.row, r.sender, r.receiver);
			});
		});
		return () => {
			alive = false;
		};
	}, [roomId, assets]);
	const listService = listType ? services[listType] : null;
	const trG = (key, ...args) => (assets?.translation[key] ?? key).replace(/%(\d*)(?:([bd])\(([^)]*)\))?/g, (_m, i, kind, opts) => {
		const arg = args[Number(i) || 0];
		if (kind === "b") return (opts ?? "").split("|")[arg ? 0 : 1] ?? "";
		if (kind === "d") return (opts ?? "").split("|")[0] ?? "";
		return arg === void 0 ? "" : String(arg);
	});
	const kickoutTooltip = (line) => {
		if (!assets) return "";
		if (line.icon === "kick") return trG("kickout:chat:kick", line.sender.male, line.receiver.name);
		if (line.icon === "kicked") return trG("kickout:chat:banish", line.sender.male, line.receiver.name);
		return line.sender.id === line.receiver.id ? trG("kickout:chat:defend", line.sender.male) : trG("kickout:chat:save", line.sender.male, line.receiver.name);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: sectionRef,
		className: "original-chat chat",
		style: {
			background: preferences.background === "default" ? void 0 : preferences.background,
			fontFamily: preferences.font
		},
		"aria-label": "Söhbət",
		children: [
			showScrollBtn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chat__scroll-btn",
				role: "button",
				style: { bottom: 50 },
				onClick: followEnd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__scroll-btn-icon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: assets ? translate(assets, "chat:scroll:text") : "Yeni mesajlar" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scrollRef,
				onScroll: onChatScroll,
				className: "original-chat-scroll chat__scroll",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `chat__body${small ? " chat__small" : ""}`,
					children: session.lines.filter((line) => line.kind !== "text" || !blocked.has(line.sender.id)).map((line) => line.kind === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `chat__message chat__noselect${chatMessageIsBold(line.sender, line.receiver) ? " chat__message--bold" : ""}${line.private ? " chat__message--private" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `chat__message-line${selected?.key === line.key ? " chat__message-line--selected" : ""}`,
								onClick: () => selectMessage(line),
								onContextMenu: (e) => {
									e.preventDefault();
									selectMessage(line);
								},
								onDoubleClick: () => selectMessage(line),
								onTouchStart: (e) => {
									cancelLongTap();
									if (e.touches.length === 1) longTap.current = setTimeout(() => selectMessage(line), 500);
								},
								onTouchEnd: cancelLongTap,
								onTouchMove: cancelLongTap,
								onTouchCancel: cancelLongTap,
								children: [
									!line.sender.isViewer && selected?.key === line.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "chat__report-button",
										"aria-label": `${line.sender.name}: Mesaj seçimləri`,
										onClick: () => selectMessage(line),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "chat__report-icon" })
									}),
									(() => {
										const stoneId = line.sender.isViewer ? decor.stone : line.sender.stone;
										const stone = assets && stoneId ? assets.stones[stoneId] : void 0;
										if (!stone || !assets) return null;
										const img = dialogImage(assets, stone.image, 14, 14);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "chat__stone",
											style: { display: "inline-block" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: "chat__stone-img",
												src: img.src,
												width: img.width,
												height: img.height,
												alt: "",
												crossOrigin: "anonymous"
											})
										}), " "] });
									})(),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `chat__sender-name ${chatNameClass(line.sender)}${(line.sender.isViewer ? decor.stone : line.sender.stone) && assets?.stones[(line.sender.isViewer ? decor.stone : line.sender.stone) ?? ""] ? " chat__sender-name--stone" : ""}${line.sender.isPremium ? " chat__premium-sender-name" : ""}`,
										onClick: (e) => {
											e.stopPropagation();
											setReceiver(line.sender);
											inputRef.current?.focus();
										},
										children: line.sender.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `${chatNameClass(line.sender)}${line.sender.isPremium ? " chat__premium-sender-name" : ""}`,
										children: ": "
									}),
									line.private && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chat__private-label",
										children: "(şəxsi) "
									}),
									line.receiver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chat__sender-name",
										children: line.receiver.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ", " })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chat__word-break",
										children: translations[line.key]?.shown ? translations[line.key]?.translated : line.text
									}),
									assets && needsTranslation(line.sender, VIEWER_LOCALE, line.text) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "chat__translate js-translate",
										role: "button",
										onClick: (e) => {
											e.stopPropagation();
											onTranslate(line.key, line.text);
										},
										children: translate(assets, translations[line.key]?.shown ? "dlg:translate:show_original" : "dlg:translate:show_translation")
									})
								]
							}),
							line.receiver?.id === VIEWER$1.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__reply-button",
								role: "button",
								"aria-label": "Cavab yaz",
								onClick: (e) => {
									e.stopPropagation();
									setReceiver(line.sender);
									inputRef.current?.focus();
								}
							})
						]
					}, line.key) : line.kind === "action" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `chat__action chat__action--${line.style} chat__noselect`,
						role: "button",
						onClick: () => {
							if (line.style === "vip") openVip();
							else if (line.icon === "gift" && line.sender) {
								const seat = displaySeatOf(line.sender.id);
								if (seat >= 0) window.dispatchEvent(new CustomEvent(OPEN_GIFT_FOR_SEAT_EVENT, { detail: seat }));
								else if (assets) showSourceToast(translate(assets, "warning:offline_gift:desc"));
							} else if (line.icon === "chat" && line.sender) {
								setReceiver(line.sender);
								inputRef.current?.focus();
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "chat__action-line",
							children: [line.sender && (line.style === "newcomer" || line.style === "birthday") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: (e) => {
									e.stopPropagation();
									window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender?.id }));
								}
							}), line.parts.map((part, i) => "user" in part ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `chat__sender-name ${chatNameClass(part.user)}`,
								style: {
									fontWeight: "bold",
									whiteSpace: "nowrap"
								},
								onClick: (e) => {
									e.stopPropagation();
									setReceiver(part.user);
									inputRef.current?.focus();
								},
								children: part.user.name
							}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part.text }, i))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `chat__btn-bg chat__btn-bg--${line.style}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `chat__btn chat__btn--${line.icon}` })
						})]
					}, line.key) : line.kind === "gift" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__noselect",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "chat__gift",
								src: line.image,
								width: line.imageWidth ?? 28,
								height: line.imageHeight ?? 28,
								title: line.name,
								alt: "",
								crossOrigin: "anonymous"
							}),
							line.count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "chat__count",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__icon chat__icon--count" }), line.count]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__icon chat__icon--arrows" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__multigift-receivers",
								children: line.receivers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "chat__multigift-photo-wrapper",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "chat__photo chat__multigift-photo",
										style: { backgroundImage: `url('${u.photoUrl}')` },
										title: u.name,
										onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: u.id }))
									})
								}, u.id))
							})
						]
					}, line.key) : line.kind === "bottle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__noselect",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
							}),
							line.oldImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "chat__bottle chat__bottle--old",
								src: line.oldImage,
								width: 30,
								height: 30,
								title: line.oldName,
								alt: "",
								crossOrigin: "anonymous"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__icon chat__icon--arrows" }),
							line.newImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "chat__bottle",
								src: line.newImage,
								width: 30,
								height: 30,
								title: line.newName,
								alt: "",
								crossOrigin: "anonymous"
							})
						]
					}, line.key) : line.kind === "gesture" ? preferences.smileys ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__info--multiline chat__info--gesture chat__noselect",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "chat__photo",
							style: { backgroundImage: `url('${line.sender.photoUrl}')` },
							title: line.sender.name,
							onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "chat__gesture-icons",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "chat__gesture",
								src: line.image,
								width: 40,
								height: 40,
								title: line.gestureName,
								alt: "",
								crossOrigin: "anonymous"
							})
						})]
					}, line.key) : null : line.kind === "harem" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__info--multiline chat__noselect",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `chat__icon chat__icon--${line.icon}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__info-line chat__info-line--harem",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: { color: "#878787" },
									children: [
										line.text,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__icon chat__icon--heart" }),
										line.price
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.receiver.photoUrl}')` },
								title: line.receiver.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.receiver.id }))
							})
						]
					}, line.key) : line.kind === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__noselect",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `chat__icon chat__icon--${line.style === "admin_chat" ? "admin_chat" : "ban"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "chat__info-line chat__text-format",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: line.style === "admin_chat" ? "#6fbf5c" : "#ff4545" },
								children: line.style === "ban" ? `${line.text} oyundan yasaklandı` : line.style === "disabled_ban" ? `${line.text} kullanıcısının yasağı kaldırıldı` : line.text
							})
						})]
					}, line.key) : line.kind === "kickout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__noselect",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `chat__icon chat__icon--${line.icon}`,
								title: assets ? kickoutTooltip(line) : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__icon chat__icon--arrows" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.receiver.photoUrl}')` },
								title: line.receiver.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.receiver.id }))
							}),
							line.icon === "kick" && displaySeatOf(line.receiver.id) >= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__reply-button chat__reply-button--save",
								role: "button",
								"aria-label": "Qoru",
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.receiver.id }))
							})
						]
					}, line.key) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat__info chat__noselect",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "chat__photo",
								style: { backgroundImage: `url('${line.sender.photoUrl}')` },
								title: line.sender.name,
								onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: line.sender.id }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chat__icon chat__icon--music" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "chat__info-line chat__text-format",
								children: [line.artist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [line.artist, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { color: "#808080" },
									children: line.title
								})]
							})
						]
					}, line.key))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `media-panel media-panel--${session.song ? "hidden" : "visible"}`,
				style: {
					right: 0,
					top: 6
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "media-panel__button",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "button",
						"aria-label": "Video",
						className: "media-panel__video",
						onClick: () => setListType("video")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "media-panel__button",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "button",
						"aria-label": "Musiqi",
						className: "media-panel__music",
						onClick: () => setListType("audio")
					})
				})]
			}),
			session.song && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicView, {
				song: session.song,
				muted: session.muted,
				volume: session.volume,
				onPlayer: () => setListType("audio"),
				onDj: (id) => {
					if (id) window.dispatchEvent(new CustomEvent("source:open-profile", { detail: id }));
				}
			}, session.song.key),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InteractiveHints, {}),
			preferences.smileys && emojiOpen && assets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiPicker, {
				size: emojiSize,
				vip,
				lockText: translate(assets, "chat:emoji:hint"),
				activateText: translate(assets, "chat:emoji:activate"),
				onPick: pickEmoji,
				onBecomeVip: () => {
					setEmojiOpen(false);
					openVip();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "original-chat-input",
				onSubmit: (e) => {
					e.preventDefault();
					if (!text.trim()) return;
					if (emojiSendDecision(text, vip) === "warn") {
						setEmojiWarning(text);
						return;
					}
					doSend(text);
				},
				children: [
					receiver?.private && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chat__private-badge",
						role: "button",
						"aria-label": "Şəxsi mesajı ləğv et",
						title: "Yalnız bu oyunçu görür",
						onClick: () => setReceiver(void 0),
						children: "Şəxsi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						className: "original-chat-input-field",
						type: "text",
						maxLength: 300,
						placeholder: assets ? translate(assets, "chat:input_hint") : "Mesaj yaz",
						"aria-label": "Mesaj yaz",
						value: receiver ? `${receiver.name}, ${text}` : text,
						onChange: (e) => {
							const prefix = receiver ? `${receiver.name}, ` : "";
							if (prefix && !e.target.value.startsWith(prefix)) setReceiver(void 0);
							setText(prefix && e.target.value.startsWith(prefix) ? e.target.value.slice(prefix.length) : e.target.value);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						type: "button",
						className: "original-chat-round original-chat-emoji js-emoji",
						disabled: !preferences.smileys,
						onClick: toggleEmoji,
						"aria-expanded": emojiOpen,
						"aria-label": "Emoji",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "original-chat-control-image",
							src: original_chat_emoji_default,
							width: 26,
							height: 26,
							alt: ""
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						type: "button",
						className: "original-chat-round original-chat-gift",
						"aria-label": "Hədiyyə",
						onClick: () => {
							const seat = receiver ? displaySeatOf(receiver.id) : void 0;
							if (seat === void 0 || seat < 0) {
								showSourceToast(receiver && assets ? translate(assets, "warning:offline_gift:desc") : "Hədiyyə göndərmək üçün oyunçu seçin.");
								return;
							}
							window.dispatchEvent(new CustomEvent(OPEN_GIFT_FOR_SEAT_EVENT, { detail: seat }));
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "original-chat-control-image",
							src: giftIcon.url,
							width: 26,
							height: 26,
							alt: ""
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						type: "submit",
						className: "original-chat-round original-chat-send",
						"aria-label": "Göndər",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "original-chat-control-image",
							src: original_chat_send_default,
							width: 26,
							height: 26,
							alt: ""
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chat__safe-area",
				"aria-hidden": "true"
			}),
			assets && selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageActions, {
				assets,
				blocked: blocked.has(selected.sender.id),
				translationShown: Boolean(translations[selected.key]?.shown),
				canTranslate: needsTranslation(selected.sender, VIEWER_LOCALE, selected.text),
				busy: menuBusy,
				onClose: () => setSelected(null),
				onTranslate: () => {
					onTranslate(selected.key, selected.text);
					setSelected(null);
				},
				onReport: () => {
					setReportMessage(selected);
					setSelected(null);
				},
				isOwn: Boolean(selected.sender.isViewer),
				onDelete: isAdmin && selected.messageId !== void 0 ? () => {
					const id = selected.messageId;
					if (id === void 0) return;
					setSelected(null);
					deleteChatMessage(id).then((ok) => {
						if (!ok) showSourceToast("Mesaj silinmədi.");
					});
				} : void 0,
				onIgnore: () => {
					setMenuBusy(true);
					setUserBlocked(selected.sender.id, !blocked.has(selected.sender.id)).then(() => setSelected(null), () => showSourceToast("Bloklama yadda saxlanılmadı.")).finally(() => setMenuBusy(false));
				}
			}),
			assets && reportMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceInfoDialog, {
				title: translate(assets, "dlg:report_issue:title"),
				context: translate(assets, "dlg:report_issue:desc", reportMessage.sender.name, reportMessage.text),
				onClose: () => setReportMessage(null),
				cancel: {
					title: translate(assets, "dlg:report_issue:cancel"),
					onClick: () => setReportMessage(null)
				},
				confirm: {
					title: translate(assets, "dlg:report_issue:ok"),
					onClick: () => {
						setReportMessage(null);
						showSourceToast("Şikayət xidməti hazırda əlçatan deyil; şikayət göndərilmədi.");
					}
				}
			}),
			assets && emojiWarning !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceInfoDialog, {
				title: translate(assets, "dlg:emoji:title"),
				context: translate(assets, "dlg:emoji:desc2"),
				onClose: () => setEmojiWarning(null),
				cancel: {
					title: translate(assets, "dlg:emoji:send2"),
					onClick: () => {
						const v = emojiWarning;
						setEmojiWarning(null);
						doSend(v);
					}
				},
				confirm: {
					title: translate(assets, "dlg:emoji:subscribe"),
					onClick: () => {
						setEmojiWarning(null);
						openVip();
					}
				}
			}),
			assets && listService && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicListDialog, {
				open: !!listType,
				type: listType ?? "audio",
				assets,
				service: listService,
				onPurchase: (music) => setPreview({
					music,
					service: listService
				}),
				onClose: () => setListType(null)
			}),
			assets && preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicPreviewDialog, {
				open: !!preview,
				assets,
				service: preview.service,
				music: preview.music,
				onClose: () => setPreview(null),
				onConfirm: (music) => {
					setPreview(null);
					setListType(null);
					sendMusic(music, preview.service).then((res) => {
						if (res.ok) return;
						if (res.reason.includes("insufficient")) window.dispatchEvent(new Event("source:open-bank"));
						else showSourceToast("Musiqi göndərilmədi.");
					});
				}
			})
		]
	});
}
/** TableUserView.kickoutView: KickoutView.animateKick / animateSave / animateTimer for every seat, shared live. */
function KickoutSeatFx({ assets, seatPoint }) {
	const room = useRoom();
	const feature = useSourceFeatureSession();
	const [anims, setAnims] = (0, import_react.useState)({});
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(Date.now()), 250);
		return () => window.clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		setAnims({});
		const timers = /* @__PURE__ */ new Map();
		const off = onRoomKickout((ev) => {
			window.clearTimeout(timers.get(ev.target_id));
			timers.delete(ev.target_id);
			if (ev.kind === "kicked") {
				setAnims((a) => {
					const next = { ...a };
					delete next[ev.target_id];
					return next;
				});
				return;
			}
			const kind = ev.kind;
			timers.set(ev.target_id, window.setTimeout(() => {
				timers.delete(ev.target_id);
				playSfx(assets.sfxUrl, kind);
			}, kind === "kick" ? 1165 : 200));
			setAnims((a) => ({
				...a,
				[ev.target_id]: {
					kind,
					until: Date.now() + (kind === "kick" ? 1700 : 3300),
					nonce: ev.id
				}
			}));
		});
		return () => {
			off();
			timers.forEach((timer) => window.clearTimeout(timer));
		};
	}, [assets, room.roomId]);
	if (typeof document === "undefined") return null;
	const targets = feature.kickout?.targets ?? {};
	const items = room.players.flatMap((p) => {
		if (!p) return [];
		const candidate = anims[p.id];
		const anim = candidate && candidate.until > now ? candidate : void 0;
		const kickAt = targets[p.id]?.kickAt;
		const left = kickAt ? Math.ceil((kickAt - now) / 1e3) : 0;
		if (!anim && left <= 0) return [];
		const pt = seatPoint(displaySeatOf(p.id));
		if (!pt) return [];
		return [{
			id: p.id,
			pt,
			anim,
			left
		}];
	});
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: items.map(({ id, pt, anim, left }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `kick-fx${anim?.kind === "kick" ? " kick-fx--kicking" : ""}${anim?.kind === "save" ? " kick-fx--saving" : ""}`,
		style: {
			left: pt.x,
			top: pt.y,
			transform: `scale(${pt.scale ?? 1})`,
			transformOrigin: "0 0"
		},
		"data-testid": "kick-fx",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kick-fx__shake",
			children: [
				anim?.kind === "kick" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "kick-fx__blast",
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='_Слой_2'%20data-name='Слой_2'%20xmlns='http://www.w3.org/2000/svg'%20width='549'%20height='558'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20549%20558'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20url(%23_Безымянный_градиент_5);%20}%20%3c/style%3e%3clinearGradient%20id='_Безымянный_градиент_5'%20data-name='Безымянный%20градиент%205'%20x1='439.28'%20y1='111.3'%20x2='94.1'%20y2='460.47'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20stop-color='%23ff6e2c'/%3e%3cstop%20offset='1'%20stop-color='%23ff5136'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20id='_Слой_1-2'%20data-name='Слой_1'%3e%3cpolygon%20class='cls-1'%20points='162%200%20156.26%20159.29%200%20180%20115.85%20291.14%2038.19%20431.12%20192.14%20405.71%20252%20558%20328.83%20416.85%20478.69%20463.22%20421.02%20312.98%20549%20225%20400.13%20176.57%20412.79%2019.2%20282.05%20108.36%20162%200'/%3e%3c/g%3e%3c/svg%3e",
					alt: ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "kick-fx__boot",
					src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='_Слой_2'%20data-name='Слой%202'%20xmlns='http://www.w3.org/2000/svg'%20width='516.51'%20height='325'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20516.51%20325'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20%236e424a;%20}%20.cls-2%20{%20fill:%20%23fff764;%20opacity:%20.3;%20}%20.cls-2,%20.cls-3%20{%20isolation:%20isolate;%20}%20.cls-4%20{%20fill:%20url(%23_Безымянный_градиент);%20}%20.cls-5%20{%20fill:%20url(%23_Безымянный_градиент_2);%20}%20.cls-3%20{%20opacity:%20.2;%20}%20%3c/style%3e%3clinearGradient%20id='_Безымянный_градиент'%20data-name='Безымянный%20градиент'%20x1='258.27'%20y1='2337.06'%20x2='258.27'%20y2='2106.82'%20gradientTransform='translate(0%20-2081)'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20stop-color='%23fa0'/%3e%3cstop%20offset='.5'%20stop-color='%23ffb700'/%3e%3cstop%20offset='.9'%20stop-color='%23ffbf00'/%3e%3c/linearGradient%3e%3clinearGradient%20id='_Безымянный_градиент_2'%20data-name='Безымянный%20градиент%202'%20x1='77.25'%20y1='2910.58'%20x2='77.25'%20y2='2792.94'%20gradientTransform='translate(0%20-2659)'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20stop-color='%23f90'/%3e%3cstop%20offset='.8'%20stop-color='%23ff9400'%20stop-opacity='.3'/%3e%3c/linearGradient%3e%3c/defs%3e%3cg%20id='_Слой_2-2'%20data-name='%20Слой%202'%3e%3cg%20id='_Слой_2-2'%20data-name='%20Слой%202-2'%3e%3cg%3e%3cpath%20class='cls-3'%20d='M494.66,176.51c-.27-.46-14.9-26.82-55.4-46.14-13.9-5.31-28.61-7.6-46.26-7.6h-61.25c-.27,0-4.75-.37-7.04-2.01.64-1.92,1.1-4.39,1.1-7.23-.09-9.06-5.67-15.38-7.59-17.3l-11.79-11.99c-1.74-1.83-6.95-5.68-12.43-6.96-5.3-1.19-10.88.27-11.88.55-3.57-3.66-7.31-7.42-10.97-11.17,4.3-10.71-2.1-20.23-6.49-24.72l-11.79-11.99c-3.47-3.57-13.35-11.81-23.95-6.5-5.76-5.86-9.69-9.89-10.6-10.89C206.88.46,186.77,0,185.58,0H39.31C3.93,0,0,34.88,0,46.69v241.69c0,2.84.55,14.74,8.32,24.44,9.87,11.81,22.67,12.18,26.42,12.18h113.36c1.65,0,6.67,0,10.79-2.2,12.8-6.87,12.07-22.52,12.07-22.52h57.59c.27,4.21,1.74,11.44,7.95,17.67,4.48,4.58,10.15,7.05,16.73,7.05h225.8c4.48,0,11.52-1.46,18.65-5.77,11.7-6.96,18.83-18.22,18.83-30.85v-41.2c-.37-18.49-5.94-46.32-21.85-70.68Z'/%3e%3cpath%20class='cls-4'%20d='M16.46,46.23v209.19h483.6s1.83-43.94-23.68-77.54c-26.97-34.42-58.14-39.64-82.37-39.64h-61.25s-12.16.46-20.11-7.32c-7.95-7.78-105.13-107.11-105.13-107.11,0,0-6.03-7.32-21.03-7.32H39.31s-22.85,0-22.85,29.75h0Z'/%3e%3cpath%20class='cls-1'%20d='M16.46,288.38s-.64,7.69,4.57,13.82c5.94,7.14,13.71,6.32,13.71,6.32h113.36s6.4,0,6.4-6.41v-18.31h90.5v14.65s-.37,10.07,8.23,10.07h225.8c10.06,0,21.03-9.15,21.03-19.23v-33.87H16.46v32.96Z'/%3e%3cpath%20class='cls-5'%20d='M16.46,136.41s48.73.37,83.83,36.89c37.02,38.27,37.76,82.12,37.76,82.12H16.46v-119.01Z'/%3e%3cpath%20class='cls-2'%20d='M476.37,177.88c-26.97-34.42-58.14-39.64-82.37-39.64h-61.25s-12.16.46-20.11-7.32c-7.95-7.78-105.13-107.11-105.13-107.11,0,0-6.03-7.32-21.03-7.32H39.31s-22.85,0-22.85,29.75h0v16.02h0c0-29.75,22.85-30.21,22.85-30.21h140.78c9.14,0,15.54,2.75,21.03,8.24,26.88,26.92,96.35,97.41,104.22,105.28,7.86,7.87,25.6,9.15,25.6,9.15h62.16c24.23,0,56.22,4.12,83.19,38.45,15.36,19.59,22.67,42.3,23.77,57.58-.37-12.18-3.2-45.87-23.68-72.87h0Z'/%3e%3cpath%20class='cls-1'%20d='M190.13,80.67l39.43-39.49c3.56-3.56,9.37-3.56,12.93,0l11.64,11.65c3.56,3.56,3.56,9.38,0,12.95l-39.43,39.49c-6.78,6.79-17.78,6.79-24.56,0h0c-6.78-6.79-6.78-17.81,0-24.6h0Z'/%3e%3cpath%20class='cls-1'%20d='M242.74,135.59l39.43-39.49c3.56-3.56,9.37-3.56,12.93,0l11.64,11.65c3.56,3.56,3.56,9.38,0,12.95l-39.43,39.49c-6.78,6.79-17.78,6.79-24.56,0h0c-6.78-6.79-6.78-17.81,0-24.6h0Z'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e",
					alt: ""
				})] }),
				anim?.kind === "save" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "kick-fx__shield",
					src: "/assets/kick-shield-BpEp79bL.svg",
					alt: ""
				}),
				anim?.kind !== "kick" && left > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `kick-fx__timer${left <= 10 ? " kick-fx__timer--red" : ""}`,
					"aria-label": `Şutlanmaya ${left} saniye`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='_Слой_2'%20data-name='Слой%202'%20xmlns='http://www.w3.org/2000/svg'%20width='685'%20height='270'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20685%20270'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20none;%20}%20.cls-2%20{%20opacity:%20.8;%20}%20.cls-2,%20.cls-3%20{%20fill-rule:%20evenodd;%20}%20.cls-3%20{%20fill:%20%23fff;%20}%20.cls-4%20{%20clip-path:%20url(%23clippath-1);%20}%20.cls-5%20{%20clip-path:%20url(%23clippath-3);%20}%20.cls-6%20{%20clip-path:%20url(%23clippath-2);%20}%20.cls-7%20{%20clip-path:%20url(%23clippath);%20}%20%3c/style%3e%3cclipPath%20id='clippath'%3e%3crect%20class='cls-1'%20width='685'%20height='270'/%3e%3c/clipPath%3e%3cclipPath%20id='clippath-1'%3e%3crect%20class='cls-1'%20width='685'%20height='270'/%3e%3c/clipPath%3e%3cclipPath%20id='clippath-2'%3e%3crect%20class='cls-1'%20width='685'%20height='270'/%3e%3c/clipPath%3e%3cclipPath%20id='clippath-3'%3e%3crect%20class='cls-1'%20width='685'%20height='270'/%3e%3c/clipPath%3e%3c/defs%3e%3cg%20id='_Слой_2-2'%20data-name='%20Слой%202'%3e%3cg%20class='cls-7'%3e%3cg%20class='cls-4'%3e%3cg%20class='cls-6'%3e%3cg%20class='cls-5'%3e%3cpath%20class='cls-2'%20d='M151.48,0s-10.91,2.08-12.18,13.8l-3.79,49.1-48.33,7.5c-5.59.9-10.28,4.9-11.98,10.4s0,11.5,4.09,15.4l9.39,8.8h-22.17c-6.19,0-12.38,2.5-16.88,7L7.89,154.2c-9.19,9.4-9.19,24.6,0,33.9l74.39,74.9c4.59,4.7,10.68,7,16.78,7h451.84c73.99,0,134.1-60.4,134.1-135S624.99,0,551,0H151.48Z'/%3e%3c/g%3e%3c/g%3e%3cpath%20class='cls-3'%20d='M30.6,171.1l37-37.2h10.1v12.6c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9v-12.6h18.1v12.6c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9v-12.6h5.7c7.1,0,13.9-2.8,19-7.8l18.6-18.3c5.5-5.5,12.7-8.5,20.5-8.5s14.3,2.8,19.7,7.8l-119.9,120.5-56.4-56.5ZM231.3,112.3l-14.1-14.2c-8.3-8.4-19.3-12.6-30.2-12.6s-21.9,4.2-30.2,12.6l-18.5,18.2c-2.5,2.5-5.8,3.8-9.3,3.8h-63.3c-2.4,0-4.6.9-6.3,2.6l-41.8,42.1c-3.5,3.5-3.5,9.2,0,12.7l74.4,74.9c3.5,3.5,9.1,3.5,12.6,0l32.1-32.3c1.7-1.8,1.7-4.6,0-6.3l-3.5-3.5,21-21.1,3.5,3.5c1.7,1.8,4.6,1.8,6.3,0l67.3-67.7c3.5-3.5,3.5-9.2,0-12.7'/%3e%3cpath%20class='cls-3'%20d='M302.2,101.4l-58.1-18.2,4.4-61-50.3,34.3-44.7-41.5-4.7,61-60.1,9.3,24.8,23.3h15.5c.5,0,19.7-18.6,19.7-18.6,10.2-10.3,23.8-15.9,38.3-15.9s28.1,5.7,38.3,15.9l14.1,14.2c3.9,3.9,6,9,6,14.5s-2.1,10.6-6,14.5l-65.5,65.9,11.4,29.1,30.6-52.9,58.2,17.9-22.1-57,50.2-34.6h0v-.2h0Z'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e",
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: left })]
				})
			]
		}, anim?.nonce ?? 0)
	}, id)) }), document.body);
}
/** Telegram ServerTimestamp.zodiacSymbol; indices match the original SVG classes. */
function telegramZodiac(birthday) {
	if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return void 0;
	const date = /* @__PURE__ */ new Date(`${birthday}T00:00:00Z`);
	if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== birthday) return void 0;
	const m = date.getUTCMonth() + 1, d = date.getUTCDate();
	return [
		[
			12,
			23,
			1,
			20,
			9
		],
		[
			1,
			21,
			2,
			19,
			10
		],
		[
			2,
			20,
			3,
			20,
			11
		],
		[
			3,
			21,
			4,
			20,
			0
		],
		[
			4,
			21,
			5,
			21,
			1
		],
		[
			5,
			22,
			6,
			21,
			2
		],
		[
			6,
			22,
			7,
			22,
			3
		],
		[
			7,
			23,
			8,
			21,
			4
		],
		[
			8,
			22,
			9,
			23,
			5
		],
		[
			9,
			24,
			10,
			23,
			6
		],
		[
			10,
			24,
			11,
			22,
			7
		],
		[
			11,
			23,
			12,
			22,
			8
		]
	].find(([m1, d1, m2, d2]) => m === m1 && d >= d1 || m === m2 && d <= d2)?.[4];
}
/** Re-evaluate current membership, not the seat where a profile was first opened. */
function profileIsAtTable(id, players) {
	return Boolean(id && players.some((p) => p?.id === id));
}
/** ca.setCount: "Say" is clamped to 1..100. */
function clampGiftCount(value) {
	const n = Math.floor(Number(value));
	return Math.max(1, Math.min(100, Number.isFinite(n) ? n : 1));
}
/** Total DAT for one tap: price is charged per receiver. */
function premiumTotal(price, receivers) {
	return price * Math.max(0, receivers);
}
function tapPremium(state, type, now) {
	if (state.type === type && now - state.at < 3500) return {
		send: true,
		next: {
			type: null,
			at: 0
		}
	};
	return {
		send: false,
		next: {
			type,
			at: now
		}
	};
}
function armMessage(name, price, receivers) {
	const total = premiumTotal(price, receivers);
	return receivers > 1 ? `💎 ${name} · ${total} DAT (${receivers} nəfərə) — göndərmək üçün yenidən toxun` : `💎 ${name} · ${total} DAT — göndərmək üçün yenidən toxun`;
}
/** Zd.onResult error toasts. */
function premiumReasonText(reason) {
	if (reason.includes("insufficient")) return "Kifayət qədər DAT yoxdur 💎";
	if (reason.includes("receiver_left")) return "Alıcı masadan çıxıb";
	if (reason.includes("self_gift")) return "Özünə hədiyyə göndərmək olmaz";
	return "Hədiyyə göndərilmədi";
}
function announceText(row) {
	return `${row.gift_name} · 💎 ${row.dat} DAT${row.reward_dat ? ` · alana +${row.reward_dat} DAT` : ""}${row.room_id ? ` · Masa ${row.room_id}` : ""}`;
}
/** localStorage giftAutoMode: anything but "manual" means auto. */
function readAutoMode(stored) {
	return stored !== "manual";
}
var bem$2 = (block) => (element, mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.filter(Boolean).map((mod) => `${base}--${mod}`)].join(" ");
};
var cls$2 = bem$2("send-gift");
var ITEM_WIDTH = 72;
var toolbar = {
	auto: (() => {
		try {
			return readAutoMode(typeof window !== "undefined" ? window.localStorage.getItem("giftAutoMode") : null);
		} catch {
			return true;
		}
	})(),
	count: 1,
	setAuto(on) {
		this.auto = on;
		try {
			window.localStorage.setItem("giftAutoMode", on ? "auto" : "manual");
		} catch {}
	},
	setCount(v) {
		this.count = clampGiftCount(v);
		return this.count;
	}
};
function GiftPanelToolbar({ vip, premium, hasPremium, dat, auto, onPremium, onAuto }) {
	const [count, setCount] = (0, import_react.useState)(toolbar.count);
	const apply = (v) => setCount(toolbar.setCount(v));
	const stop = (e) => e.stopPropagation();
	const btn = hasPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cls$2("premium-btn", [premium && "on"]),
		onClick: () => onPremium(!premium),
		children: premium ? "← Adi" : "💎 Premium"
	});
	if (premium) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls$2("toolbar", ["premium"]),
		onTouchStart: stop,
		onMouseDown: stop,
		children: [btn, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cls$2("premium-info"),
			children: (dat !== null && dat !== void 0 ? `💎 ${dat} DAT · ` : "") + "alıcı qiymətin yarısını DAT kimi alır"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cls$2("toolbar"),
		onTouchStart: stop,
		onMouseDown: stop,
		children: [
			btn,
			vip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$2("mode"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cls$2("mode-btn", [auto && "on"]),
					onClick: () => onAuto(true),
					children: "Avtomatik"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cls$2("mode-btn", [!auto && "on"]),
					onClick: () => onAuto(false),
					children: "Əl ilə"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cls$2("qty"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cls$2("qty-label"),
						children: "Say"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cls$2("qty-btn"),
						onClick: () => apply(count - 1),
						children: "−"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: cls$2("qty-input"),
						type: "number",
						inputMode: "numeric",
						min: 1,
						max: 100,
						value: count,
						onChange: (e) => {
							const v = parseInt(e.currentTarget.value, 10);
							if (v >= 1) {
								toolbar.setCount(v);
								setCount(toolbar.count);
							} else setCount(e.currentTarget.value);
						},
						onBlur: (e) => apply(e.currentTarget.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") e.currentTarget.blur();
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cls$2("qty-btn"),
						onClick: () => apply(count + 1),
						children: "+"
					})
				]
			})
		]
	});
}
function GiftItem({ assets, item, onSend, onPreload, onLocked, crystal = false, autoRepeat = true }) {
	const run = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => {
		if (run.current) window.clearInterval(run.current.timer);
	}, []);
	const ref = (0, import_react.useRef)(null);
	const timer = (0, import_react.useRef)(void 0);
	const img = item.icon ? {
		src: item.icon,
		width: 60,
		height: 60
	} : dialogImage(assets, item.image, 60, 60);
	const hold = (0, import_react.useRef)({ fired: false });
	const stopHold = () => {
		window.clearTimeout(hold.current.delay);
		window.clearInterval(hold.current.repeat);
	};
	(0, import_react.useEffect)(() => () => {
		window.clearTimeout(timer.current);
		stopHold();
	}, []);
	(0, import_react.useEffect)(() => {
		const root = ref.current?.closest(".popup__content");
		if (!root) return;
		const onScroll = () => {
			hold.current.moved = true;
			stopHold();
		};
		root.addEventListener("scroll", onScroll, { passive: true });
		return () => root.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		const element = ref.current;
		if (!element) return;
		let timer;
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				timer = window.setTimeout(() => onPreload(item), 120);
				observer.disconnect();
			}
		}, {
			root: element.closest(".popup__content"),
			rootMargin: "80px"
		});
		observer.observe(element);
		return () => {
			observer.disconnect();
			window.clearTimeout(timer);
		};
	}, [item, onPreload]);
	const showLeft = (n) => {
		const el = ref.current;
		if (!el) return;
		if (n > 0) el.setAttribute("data-left", String(n));
		else el.removeAttribute("data-left");
	};
	const fire = () => {
		onSend(item);
		const el = ref.current;
		if (!el) return;
		window.clearTimeout(timer.current);
		el.classList.add(cls$2("item", ["active"]).split(" ")[1] ?? "");
		timer.current = window.setTimeout(() => el.classList.remove("send-gift__item--active"), 500);
	};
	const activate = () => {
		if (item.lock) {
			onLocked?.(item);
			return;
		}
		if (run.current) {
			window.clearInterval(run.current.timer);
			run.current = null;
			showLeft(0);
			return;
		}
		const count = crystal ? 1 : toolbar.count;
		if (count <= 1) {
			fire();
			return;
		}
		const state = { left: count };
		run.current = state;
		const step = () => {
			if (run.current !== state) return;
			fire();
			state.left--;
			showLeft(state.left);
			if (state.left <= 0) {
				window.clearInterval(state.timer);
				run.current = null;
				showLeft(0);
			}
		};
		state.timer = window.setInterval(step, 180);
		step();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: `${cls$2("item")} touch-manipulation`,
		"data-code": item.type,
		title: item.name,
		onClick: () => {
			if (hold.current.tapped) {
				hold.current.tapped = false;
				return;
			}
			if (hold.current.fired || hold.current.moved) {
				hold.current.fired = false;
				hold.current.moved = false;
				return;
			}
			stopHold();
			activate();
		},
		onPointerEnter: () => onPreload(item),
		onPointerDown: (e) => {
			onPreload(item);
			stopHold();
			hold.current.fired = false;
			hold.current.moved = false;
			hold.current.x = e.clientX;
			hold.current.y = e.clientY;
			if (item.lock || !autoRepeat) return;
			hold.current.delay = window.setTimeout(() => {
				hold.current.fired = true;
				fire();
				hold.current.repeat = window.setInterval(fire, 120);
			}, 350);
		},
		onPointerMove: (e) => {
			if (Math.abs(e.clientX - (hold.current.x ?? e.clientX)) > 8 || Math.abs(e.clientY - (hold.current.y ?? e.clientY)) > 8) {
				hold.current.moved = true;
				stopHold();
			}
		},
		onPointerUp: (e) => {
			stopHold();
			if (e.pointerType !== "mouse" && !hold.current.fired && !hold.current.moved) {
				hold.current.tapped = true;
				activate();
			}
		},
		onPointerLeave: stopHold,
		onPointerCancel: () => {
			hold.current.moved = true;
			stopHold();
		},
		onContextMenu: (e) => e.preventDefault(),
		role: "button",
		"aria-label": item.name,
		tabIndex: 0,
		onKeyDown: (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				activate();
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cls$2("image-block"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: cls$2("image", [item.lock && "locked"]),
				draggable: false,
				src: img.src,
				width: img.width,
				height: img.height,
				alt: "",
				crossOrigin: "anonymous",
				loading: "lazy",
				decoding: "async"
			})
		}), item.lock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$2("subitem"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$2("icon", [item.lock.kind === "vip" ? "viplock" : "lock"]) }), item.lock.kind === "kisses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cls$2("price"),
				children: item.lock.need
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cls$2("subitem", [!item.price && "invisible"]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$2("icon", [crystal ? "crystal" : "heart"]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cls$2("price"),
				children: item.price
			})]
		})]
	});
}
function SendGiftDialog({ open, assets, items, receiverName, onSend, onPreload, onClose, onLocked, onProfile, selective = false, multiselect, vip = false, premiumItems = [], dat, onPremiumTap, onPremiumOpen }) {
	const [premium, setPremium] = (0, import_react.useState)(false);
	const [auto, setAuto] = (0, import_react.useState)(toolbar.auto);
	(0, import_react.useEffect)(() => {
		if (!open) setPremium(false);
		else onPremiumOpen?.();
	}, [open]);
	const listRef = (0, import_react.useRef)(null);
	const [box, setBox] = (0, import_react.useState)(null);
	const [showProfile, setShowProfile] = (0, import_react.useState)(false);
	(0, import_react.useLayoutEffect)(() => {
		if (!open) return;
		const place = () => {
			const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
			const top = chat && chat.height > 120 ? chat.top : Math.round(window.innerHeight * .5);
			const left = chat ? chat.left : 0;
			const width = chat ? chat.width : window.innerWidth;
			const headerBar = document.querySelector(".original-table-header")?.getBoundingClientRect().height ?? 84;
			setBox({
				top,
				left,
				width,
				header: Math.min(headerBar, top)
			});
		};
		place();
		window.addEventListener("resize", place);
		const id = window.setTimeout(() => setShowProfile(true), 0);
		return () => {
			window.removeEventListener("resize", place);
			window.clearTimeout(id);
			setShowProfile(false);
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setShowProfile(false);
		const id = window.setTimeout(() => setShowProfile(true), 0);
		return () => window.clearTimeout(id);
	}, [open, receiverName]);
	(0, import_react.useLayoutEffect)(() => {
		const list = listRef.current;
		if (!open || !list) return;
		const align = () => {
			const width = list.clientWidth;
			const cols = Math.max(1, Math.floor(width / ITEM_WIDTH));
			const spacing = Math.floor((width - cols * ITEM_WIDTH) / (cols + 1));
			list.style.padding = `${spacing}px 0 ${spacing}px ${spacing}px`;
			for (const child of Array.from(list.children)) child.style.margin = `0 ${spacing}px ${spacing}px 0`;
		};
		align();
		const ro = new ResizeObserver(align);
		ro.observe(list);
		return () => ro.disconnect();
	}, [
		open,
		box,
		items.length,
		premium,
		premiumItems.length
	]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const key = (e) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [open, onClose]);
	if (!open || !box) return null;
	const title = translate(assets, "dlg:gift:title", "").replace("%", "").trim();
	const openMusic = (type) => {
		onClose();
		window.dispatchEvent(new CustomEvent("source:open-music-list", { detail: { type } }));
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1e3,
			fontFamily: "Arial, Helvetica, sans-serif",
			pointerEvents: "none"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-drawer-dismiss",
				onClick: (e) => {
					e.stopPropagation();
					onClose();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `popup__header ${cls$2("x_header")} send-gift__x_header--teaser`,
				style: {
					position: "absolute",
					top: 0,
					left: box.left,
					width: box.width,
					height: box.header,
					paddingTop: "env(safe-area-inset-top, 0px)",
					boxSizing: "border-box",
					pointerEvents: "auto",
					zIndex: 2
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `popup__title popup__title--left ${cls$2("x_popup__title")}`,
					children: selective && multiselect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cls$2("multi-title"),
						children: multiselect.title
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [onProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${cls$2("btn", ["profile"])} ${showProfile ? "send-gift__show-profile" : ""}`,
						role: "button",
						"aria-label": "Profil",
						onClick: (e) => {
							e.stopPropagation();
							onProfile();
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "send-gift__recipient",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cls$2("gift-title"),
							children: title.charAt(0).toLocaleUpperCase("tr") + title.slice(1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${cls$2("name")} ${showProfile ? "send-gift__show-name" : ""}`,
							children: receiverName
						})]
					})] })
				}), multiselect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cls$2("multigift-btn-list"),
					children: selective ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cls$2("multigift-gender-list"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cls$2("btn", ["men"]),
								role: "button",
								"aria-label": "Kişiləri seç",
								onClick: (e) => {
									e.stopPropagation();
									multiselect.onSelectMen();
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cls$2("btn", ["women"]),
								role: "button",
								"aria-label": "Qadınları seç",
								onClick: (e) => {
									e.stopPropagation();
									multiselect.onSelectWomen();
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cls$2("btn", ["cancel"]),
								role: "button",
								"aria-label": "Çoxlu seçimi ləğv et",
								onClick: (e) => {
									e.stopPropagation();
									multiselect.onSelectState(false);
								}
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cls$2("btn", ["add"]),
						role: "button",
						"aria-label": "Bir neçə oyunçuya hədiyyə",
						onClick: (e) => {
							e.stopPropagation();
							multiselect.onSelectState(true);
						}
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": `${title} ${receiverName}`,
				className: "popup popup--absolute",
				style: {
					top: box.top,
					left: box.left,
					width: box.width,
					bottom: 0,
					pointerEvents: "auto"
				},
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__close-drawer-bg",
					style: { zIndex: 1 },
					onClick: onClose,
					role: "button",
					"aria-label": "Bağla",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__close popup__close--drawer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `popup__content popup__content--no-padding ${cls$2("x_popup__content")}`,
					style: { flex: 1 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftPanelToolbar, {
						vip,
						premium,
						hasPremium: premiumItems.length > 0,
						dat,
						auto,
						onPremium: setPremium,
						onAuto: (on) => {
							toolbar.setAuto(on);
							setAuto(on);
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: listRef,
						className: cls$2("", ["gift"]),
						children: [
							premium && premiumItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftItem, {
								assets,
								item,
								crystal: true,
								autoRepeat: false,
								onSend: (i) => onPremiumTap?.(i),
								onPreload
							}, `p-${item.type}`)),
							!premium && !selective && [{
								type: "video",
								image: "g_video_v3",
								price: 9,
								label: "music:video"
							}, {
								type: "audio",
								image: "g_music_v3",
								price: 5,
								label: "music:audio"
							}].map((media) => {
								const image = dialogImage(assets, media.image, 60, 60);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									className: `${cls$2("item")} p-0 gap-0 whitespace-normal`,
									"aria-label": translate(assets, media.label),
									title: translate(assets, media.label),
									onClick: () => openMusic(media.type),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cls$2("image-block"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											className: cls$2("image"),
											src: image.src,
											width: image.width,
											height: image.height,
											alt: "",
											crossOrigin: "anonymous"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cls$2("subitem"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$2("icon", ["heart"]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cls$2("price"),
											children: media.price
										})]
									})]
								}, media.type);
							}),
							!premium && items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftItem, {
								assets,
								item,
								autoRepeat: vip && auto,
								onSend,
								onPreload,
								onLocked
							}, item.type))
						]
					})]
				})]
			})
		]
	}), document.body);
}
/**
* Port of SendGiftPresenter.showResponseGift state machine from preloader.js:
* ready -> dialog (auto-closes after 30s) ; closing with X puts it on hold for 5 minutes.
*/
var RESPONSE_GIFT_AUTO_CLOSE_MS = 3e4;
var RESPONSE_GIFT_HOLD_MS = 3e5;
function supportsResponseGift(chat) {
	return Boolean(chat && chat.width >= 236 && chat.height >= 175);
}
/** Returns the next state when a gift reaches the viewer, or null when no popup must open. */
function onGiftToViewer(state, senderId, giftType, now) {
	if (state.type === "dialog") return null;
	if (state.type === "onhold" && now < state.until) return null;
	return {
		type: "dialog",
		senderId,
		giftType
	};
}
function closeByUser(now) {
	return {
		type: "onhold",
		until: now + RESPONSE_GIFT_HOLD_MS
	};
}
/** Port of ResponseGiftDialog.tsx: "X sent you a gift" + "Send a return gift" over the chat. */
function ResponseGiftPopup({ assets, sender, giftType, onConfirm, onClose, onTimeout }) {
	const [box, setBox] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const place = () => {
			const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
			if (!chat || !supportsResponseGift(chat)) {
				setBox(null);
				return;
			}
			setBox({
				top: chat.top + 20 + 30,
				left: chat.left + (chat.width - 236) / 2
			});
		};
		place();
		window.addEventListener("resize", place);
		window.visualViewport?.addEventListener("resize", place);
		return () => {
			window.removeEventListener("resize", place);
			window.visualViewport?.removeEventListener("resize", place);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const id = window.setTimeout(onTimeout, RESPONSE_GIFT_AUTO_CLOSE_MS);
		return () => window.clearTimeout(id);
	}, [
		onTimeout,
		sender.id,
		giftType
	]);
	const gift = assets.gifts[giftType];
	if (!box || !gift) return null;
	const image = dialogImage(assets, gift.storeImage, 50, 50).src;
	const message = translate(assets, "chat:gift_response:text");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "response-gift-layer",
		style: {
			top: box.top,
			left: box.left,
			width: 236,
			height: 174
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup response-gift__x_popup",
			role: "dialog",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "popup__header response-gift__x_popup__header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "response-gift__photo",
							style: { backgroundImage: `url(${sender.photoUrl})` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "response-gift__titles",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `response-gift__name${sender.premium ? " response-gift__name--premium" : ""}`,
								style: sender.premium || !sender.nameColor ? void 0 : { color: `#${sender.nameColor}` },
								children: sender.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "response-gift__message",
								children: message
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Bağla",
							className: "popup__close popup__close--response-gift",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup__close-icon" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__content response-gift__x_popup__content",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "response-gift__image",
						src: image,
						alt: ""
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__buttons response-gift__x_popup__buttons",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "button button--confirm response-gift__x_button",
						onClick: onConfirm,
						children: translate(assets, "chat:gift_response:btn")
					})
				})
			]
		})
	});
}
/** TokensPresenter.showBank + TokensBankDialog.tsx: options from the server, bought with hearts. */
var OPEN_TOKENS_BANK_EVENT = "source:open-tokens-bank";
var bem$1 = (block) => (element = "", mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.map((m) => `${base}--${m}`)].join(" ");
};
var cls$1 = bem$1("tokens-bank");
var popup$1 = bem$1("popup");
function TokensBankHost() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [assets, setAssets] = (0, import_react.useState)(null);
	const [options, setOptions] = (0, import_react.useState)(null);
	const busy = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const show = () => setOpen(true);
		window.addEventListener(OPEN_TOKENS_BANK_EVENT, show);
		return () => window.removeEventListener(OPEN_TOKENS_BANK_EVENT, show);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (!assets) loadCilizAssets().then(setAssets).catch(() => void 0);
		getSupabase()?.from("token_prices").select("gold,tokens").then(({ data }) => setOptions(data ?? []));
		const key = (e) => e.key === "Escape" && setOpen(false);
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [open, assets]);
	if (!open || !assets || !options) return null;
	const sorted = [...options].sort((a, b) => b.gold - a.gold);
	const close = () => setOpen(false);
	const buy = async (gold) => {
		if (busy.current) return;
		busy.current = true;
		const { error } = await getSupabase().rpc("buy_tokens", { p_gold: gold });
		busy.current = false;
		if (!error) {
			close();
			return;
		}
		if (error.message.includes("insufficient")) {
			close();
			window.dispatchEvent(new Event(OPEN_BANK_EVENT));
		} else showSourceToast("Jeton alınmadı.");
	};
	const title = translate(assets, "dlg:tokens_store:title", "Jeton mağazası");
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1e3,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: close
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": title,
				className: `popup ${cls$1("x_popup")} popup--center popup--show`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$1("bg") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${popup$1("header")} ${cls$1("x_popup__header")}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${popup$1("title")} ${cls$1("x_popup__title")}`,
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: popup$1("close", ["dlg"]),
							role: "button",
							"aria-label": "Bağla",
							onClick: close,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${popup$1("close-icon")} ${cls$1("x_popup__close-icon")}` })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${popup$1("content")} ${cls$1("x_popup__content")}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cls$1(""),
							children: sorted.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "button",
								className: cls$1("item"),
								onClick: () => void buy(opt.gold),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cls$1("item-bg"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cls$1("desc"),
											children: opt.tokens
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$1("opt-icon", [`${sorted.length - i}`]) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cls$1("heart"),
										children: opt.gold
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls$1("item-shadow") })
								]
							}, opt.gold))
						})
					})
				]
			})]
		})
	}), document.body);
}
/** Original ordering: available, kiss-locked, VIP-locked. Scheduled entries
* require the authenticated session; never invent a schedule or grant VIP. */
function buildGestureItems(assets, account) {
	const entries = (assets.gestureStore ?? []).flatMap((e) => e.id === "__SCHEDULED__" ? account?.scheduled ?? [] : [e]);
	const groups = [
		[],
		[],
		[]
	];
	for (const entry of entries) {
		const gesture = assets.gestures?.[entry.id];
		if (!gesture) continue;
		if (entry.social && (!account || !entry.social.includes(account.social))) continue;
		if (entry.platform && (!account || !entry.platform.includes(account.platform))) continue;
		if (entry.user_s && (!account || !entry.user_s.includes(account.userId))) continue;
		const current = account?.kisses ?? 0;
		const lock = entry.kisses_s && current < entry.kisses_s ? {
			kind: "kisses",
			needed: entry.kisses_s,
			current
		} : entry.vip_s && !account?.vip ? { kind: "vip" } : void 0;
		groups[lock?.kind === "kisses" ? 1 : lock?.kind === "vip" ? 2 : 0]?.push({
			gesture,
			name: translate(assets, `gesture:${gesture.type}`),
			...lock ? { lock } : {}
		});
	}
	return groups.flat();
}
function gestureEligibility(item, account) {
	if (!account) return "session";
	if (item.lock) return item.lock.kind;
	return account.tokens < item.gesture.storePrice ? "tokens" : "available";
}
function GestureDialog({ open, assets, account = null, onClose, onPreview, onSend, onProfile }) {
	const [box, setBox] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const listRef = (0, import_react.useRef)(null);
	const savedScroll = (0, import_react.useRef)(0);
	const items = buildGestureItems(assets, account);
	const t = (key) => translate(assets, key);
	(0, import_react.useLayoutEffect)(() => {
		if (!open) return;
		const place = () => {
			const chat = document.querySelector(".original-chat")?.getBoundingClientRect();
			setBox(chat ? {
				top: chat.top,
				left: chat.left,
				width: chat.width
			} : {
				top: window.innerHeight / 2,
				left: 0,
				width: window.innerWidth
			});
		};
		place();
		window.addEventListener("resize", place);
		return () => window.removeEventListener("resize", place);
	}, [open]);
	(0, import_react.useLayoutEffect)(() => {
		if (open && listRef.current) listRef.current.scrollTop = savedScroll.current;
	}, [open, box]);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setSelected(null);
			setStatus("");
			return;
		}
		const key = (event) => {
			if (event.key === "Escape") selected ? setSelected(null) : onClose();
		};
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [
		open,
		selected,
		onClose
	]);
	const activate = async (item) => {
		setStatus("");
		if (item.lock) {
			setSelected(item);
			return;
		}
		if (!onSend) {
			setBusy(true);
			try {
				await onPreview(item);
			} catch {
				setSelected(item);
				setStatus("Jest animasiyası yüklənmədi; yenidən cəhd edin.");
			} finally {
				setBusy(false);
			}
			return;
		}
		const eligibility = gestureEligibility(item, account);
		if (eligibility !== "available") {
			if (eligibility === "tokens") {
				window.dispatchEvent(new Event(OPEN_TOKENS_BANK_EVENT));
				return;
			}
			setSelected(item);
			setStatus("Oyunçu hesabına giriş edilməyib; jeton xərcləmək mümkün deyil.");
			return;
		}
		setBusy(true);
		try {
			await onSend(item);
		} catch {
			setStatus("Jest göndərilmədi; yenidən cəhd edin.");
		} finally {
			setBusy(false);
		}
	};
	if (!open || !box) return null;
	const image = selected ? dialogImage(assets, selected.gesture.storeImage || selected.gesture.image, 90, 90) : null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "table-drawer-dismiss table-drawer-dismiss--gesture",
			onClick: (e) => {
				e.stopPropagation();
				onClose();
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			role: "dialog",
			"aria-label": t("dlg:gesture:send"),
			className: "gesture-drawer",
			style: {
				top: box.top,
				left: box.left,
				width: box.width
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "gesture-header",
					children: [
						onProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "send-gift__btn send-gift__btn--profile gesture-profile",
							title: "Profilim",
							"aria-label": "Profilim",
							onClick: onProfile
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gesture-title",
							children: t("dlg:gesture:send")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "send-gift__tokens gesture-balance",
							title: "Jetonlar",
							"aria-label": "Jeton balansı",
							onClick: () => window.dispatchEvent(new Event(OPEN_TOKENS_BANK_EVENT)),
							children: account?.tokens ?? "—"
						})
					]
				}),
				status && !selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "gesture-status",
					children: status
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: listRef,
					className: "gesture-scroll",
					onScroll: (e) => {
						savedScroll.current = e.currentTarget.scrollTop;
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "send-gift--gesture gesture-grid",
						children: items.map((item) => {
							const img = dialogImage(assets, item.gesture.storeImage || item.gesture.image, 60, 60);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "send-gift__item gesture-item",
								title: item.name,
								"aria-label": item.name,
								disabled: busy,
								onClick: () => void activate(item),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "send-gift__image-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										className: item.lock ? "send-gift__image send-gift__image--locked" : "send-gift__image",
										src: img.src,
										width: img.width,
										height: img.height,
										alt: "",
										loading: "lazy"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "send-gift__subitem",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `send-gift__icon send-gift__icon--${item.lock ? item.lock.kind === "vip" ? "viplock" : "lock" : "token"}` }), !item.lock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "send-gift__price",
										children: item.gesture.storePrice
									})]
								})]
							}, item.gesture.type);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "popup__close popup__close--drawer gesture-close",
					"aria-label": "Jestləri bağla",
					title: "Bağla",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
				})
			]
		}),
		selected?.lock && image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceGiftLockedDialog, {
			kind: "gesture",
			image,
			title: selected.lock.kind === "vip" ? t("dlg:locked:vip:title") : t("dlg:locked_gift:title"),
			description: selected.lock.kind === "vip" ? t("dlg:locked_gesture:vip:desc") : t("dlg:locked_gesture:kiss:desc"),
			...selected.lock.kind === "kisses" ? { lock: {
				type: "kisses",
				needed: selected.lock.needed,
				...account ? { current: selected.lock.current } : {}
			} } : {},
			onClose: () => setSelected(null),
			cancel: {
				title: t("dlg:navigate_vip:btn"),
				onClick: () => setSelected(null)
			},
			info: {
				title: t("mobile:vip:know"),
				onClick: () => {
					const vip = selected.lock?.kind === "vip";
					setSelected(null);
					onClose();
					window.dispatchEvent(new CustomEvent(vip ? "source:open-vip" : "source:open-tops", { detail: "total_kisses" }));
				}
			}
		}),
		selected && !selected.lock && status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceInfoDialog, {
			title: selected.name,
			context: status,
			hasClose: true,
			onClose: () => setSelected(null),
			confirm: {
				title: t("dlg:navigate_vip:btn"),
				onClick: () => setSelected(null)
			}
		})
	] }), document.body);
}
var closedTarget = {
	receiver: null,
	selective: false,
	selected: []
};
/** showGifts(receiver): solo receiver, highlighted; re-targets an already open dialog. */
function openFor(state, seat, viewerSeat) {
	if (seat === viewerSeat) return state;
	if (state.selective && state.receiver !== null) return toggleSeat(state, seat, viewerSeat);
	return {
		receiver: seat,
		selective: false,
		selected: [seat]
	};
}
/** pointertap while selectable: isSelected = !isSelected. */
function toggleSeat(state, seat, viewerSeat) {
	if (seat === viewerSeat) return state;
	const selected = state.selected.includes(seat) ? state.selected.filter((s) => s !== seat) : [...state.selected, seat];
	return {
		...state,
		selected
	};
}
/** onselectstatechange(isSelective): selection resets to the dialog's receiver. */
function setSelective(state, selective) {
	if (state.receiver === null) return state;
	return {
		...state,
		selective,
		selected: [state.receiver]
	};
}
/** selectMen / selectWomen: adds every non-viewer of that gender, keeping existing picks. */
function selectGender(state, males, male, viewerSeat) {
	const selected = [...state.selected];
	males.forEach((isMale, seat) => {
		if (seat !== viewerSeat && isMale === male && !selected.includes(seat)) selected.push(seat);
	});
	return {
		...state,
		selected
	};
}
function seatTapAction(state, seat, viewerSeat, gesturesOpen) {
	if (seat === viewerSeat) return gesturesOpen ? "own-profile" : "gestures";
	if (!state.selective && state.receiver === seat) return "profile";
	return "gifts";
}
/** giftStore.onsend -> viewerSendGift(tablePresenter.selectedUsers): solo sends to the receiver only. */
function giftReceivers(state) {
	if (state.receiver === null) return [];
	return state.selective ? [...state.selected].sort((a, b) => a - b) : [state.receiver];
}
/** updateSelection(): selectable/selected while selective, otherwise chat highlight on the receiver. */
function seatSelection(state, seat, viewerSeat) {
	if (state.receiver === null) return "none";
	if (state.selective) return seat === viewerSeat ? "none" : state.selected.includes(seat) ? "selected" : "selectable";
	return seat === state.receiver ? "highlighted" : "none";
}
var bottleIconFallbacks = {
	"ui_arrow_kiss_down.svg": "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2022.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%20%20%20%20%20width%3D%22174%22%20height%3D%2266%22%0A%09%20viewBox%3D%220%200%20174%2066%22%20style%3D%22enable-background%3Anew%200%200%20174%2066%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%09.st0%7Bopacity%3A0.9%3B%7D%0A%09.st1%7Bfill%3A%23FF833F%3B%7D%0A%09.st2%7Bfill%3A%23EBF2DC%3B%7D%0A%09.st3%7Bopacity%3A0.4%3Bfill%3A%23D45F26%3B%7D%0A%09.st4%7Bfill%3A%23FFC449%3B%7D%0A%09.st5%7Bfill%3A%23FCD578%3B%7D%0A%09.st6%7Bfill%3A%23C26934%3B%7D%0A%09.st7%7Bfill%3A%23F9AA18%3B%7D%0A%09.st8%7Bfill%3A%23D61A3D%3B%7D%0A%09.st9%7Bfill%3A%23EE3457%3B%7D%0A%09.st10%7Bfill%3A%23FF8097%3B%7D%0A%09.st11%7Bfill%3Aurl%28%23SVGID_1_%29%3B%7D%0A%09.st12%7Bfill%3Aurl%28%23SVGID_2_%29%3B%7D%0A%09.st13%7Bfill%3Aurl%28%23SVGID_3_%29%3B%7D%0A%09.st14%7Bfill%3Aurl%28%23SVGID_4_%29%3B%7D%0A%09.st15%7Bfill%3Aurl%28%23SVGID_5_%29%3B%7D%0A%09.st16%7Bfill%3Aurl%28%23SVGID_6_%29%3B%7D%0A%09.st17%7Bfill%3Aurl%28%23SVGID_7_%29%3B%7D%0A%09.st18%7Bfill%3Aurl%28%23SVGID_8_%29%3B%7D%0A%09.st19%7Bfill%3Aurl%28%23SVGID_9_%29%3B%7D%0A%09.st20%7Bfill%3Aurl%28%23SVGID_10_%29%3B%7D%0A%09.st21%7Bfill%3A%23FFFFFF%3B%7D%0A%09.st22%7Bfill%3A%23FF6100%3B%7D%0A%09.st23%7Bopacity%3A0.8%3Bfill%3Aurl%28%23SVGID_11_%29%3B%7D%0A%09.st24%7Bfill%3Aurl%28%23SVGID_12_%29%3B%7D%0A%09.st25%7Bfill%3A%23E0B993%3B%7D%0A%09.st26%7Bfill%3Anone%3Bstroke%3A%23FFFFFF%3Bstroke-width%3A2%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A10%3B%7D%0A%09.st27%7Bopacity%3A0.15%3Bfill%3A%23020202%3B%7D%0A%09.st28%7Bfill%3A%239BCC33%3B%7D%0A%09.st29%7Bfill%3A%23E03D1F%3B%7D%0A%3C%2Fstyle%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_26%22%20viewBox%3D%22-55%20-45.9%20110.1%2091.8%22%3E%0A%09%3Cg%20class%3D%22st0%22%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M42.8-18.5c-0.1%2C2.1%2C0.7%2C3.6%2C2.2%2C5.1c1.7%2C1.6%2C4.1%2C3.6%2C4.2%2C5.5c0.3%2C7.6%2C5.2%2C13.7%2C5.8%2C21.1%0A%09%09%09C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5c-0.4-2.4%2C2-2.1%2C3.5-2.3c1.8-0.2%2C2.3-1.3%2C1.9-2.8%0A%09%09%09c-0.5-2-1.8-1.5-3.1-0.9c-1.5%2C0.7-2.9%2C1.5-4.4%2C2.1c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1c-2-3.1-5.2-2-8-2.3%0A%09%09%09c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c3.7-2.8%2C7.8-2.4%2C11.9-1.4c4%2C0.9%2C8%2C2.1%2C11.8-0.5C42.2-18.5%2C42.5-18.5%2C42.8-18.5z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M49.2%2C20.6c1.8%2C0.4%2C2.1%2C1.7%2C0.6%2C2.2c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2%0A%09%09%09c-0.1-1.3-0.7-2.7-1.8-2.8c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.1-2.9%2C4.3-3.3%2C7.8-3.3c2.5%2C1.8%2C5.1%2C0.6%2C7.1-0.5%0A%09%09%09C18.7-6%2C22.5-6%2C26.4-5.2c1.9%2C5%2C1.4%2C5.6-3.9%2C5c-1.6-0.2-3.2-0.1-4.9-0.3c-1.2-0.1-2.6-0.7-2.9%2C0.9c-0.3%2C1.4%2C1.5%2C1%2C2.2%2C1.6%0A%09%09%09c4.4%2C4.1%2C11.8%2C1.7%2C15.6%2C7.5c1.2%2C1.8%2C3.1%2C3%2C2.5%2C5.6c-0.4%2C1.8%2C0.9%2C2.3%2C2.3%2C2.4C40.4%2C22.3%2C45.1%2C20.2%2C49.2%2C20.6z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-15.1-30c0.6-0.3%2C1.2-0.7%2C1.7-1c2.8-0.4%2C2.5-2.6%2C2.5-4.6c1.7-0.2%2C3.1-0.4%2C1.4-2.6c-1.9-2.5-4.1-4.2-7.3-4.3%0A%09%09%09c-1.4-0.1-3.1-0.8-2.9-2.2c0.2-2%2C2-0.9%2C3.2-0.8C-11-45.2-5.8-43-0.3-43.1c0.9%2C0%2C1.9%2C0.3%2C2%2C1.4c0.1%2C1-0.8%2C1-1.5%2C1.2%0A%09%09%09C-4.4-39.7-2.6-38-0.6-36c1.7%2C1.6%2C3.5%2C2.8%2C5.9%2C2.3c0%2C1.5%2C0.2%2C3%2C1.1%2C4.4c-4%2C3.9-5%2C3.7-7.6-0.8c-1.1-1.9-3-2.9-4.9-1.8%0A%09%09%09c-2.2%2C1.3%2C0.2%2C2.7%2C0.4%2C4c0.3%2C2.3%2C2.9%2C2.5%2C3.4%2C4.4c-1.6%2C0-3.1%2C0.2-4.4%2C1.1C-9-25.4-13.2-26.4-15.1-30z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M13.3-24.2c0.3-1.5%2C1.1-2.7%2C2.6-2.4c1.8%2C0.4%2C4.5-0.3%2C4.9%2C2.6c0.3%2C2.2-1.5%2C2.1-3%2C2.2%0A%09%09%09C15.9-21.6%2C14.1-22%2C13.3-24.2z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M12.8-10.8c-1.1%2C3.2-3.8%2C1.9-5.9%2C1.8C5.4-9%2C6.2-10.5%2C6.5-11.4C8.6-11.2%2C10.8-12.3%2C12.8-10.8z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M6.6%2C11c2.3-0.3%2C5-1.9%2C5.8%2C2.2c0.3%2C1.4%2C2%2C0.9%2C3.1%2C1.3c1.6%2C0.6%2C4.1%2C0.6%2C4.2%2C2.7c0.1%2C2.3-2.9%2C0.6-4.6%2C3.1%0A%09%09%09c4.7-1.8%2C7.3%2C3.7%2C11.9%2C1.1c2.1-1.2%2C3.8%2C1.2%2C4.1%2C2.9c0.5%2C2.4%2C1.7%2C5.2-1.6%2C7.1c-5.3%2C3-8.7%2C4.7-15.8-1.9c-1.6-2.1-4.3-3.3-4.5-6.6%0A%09%09%09c-0.1-1.2-1.9-1.1-3.1-1.1c-0.2-1.7%2C2.3-4.4-1.3-4.7c-1.6-0.1-3.6%2C1.2-5%2C2.3c-1.4%2C1.1-0.8%2C2.3%2C1%2C2.7c-2.7%2C3.3-5.7%2C0.1-6.9-0.9%0A%09%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c2.7%2C0.8%2C4.4-1.7%2C6.7-1.6l0%2C0c4.7%2C5.3%2C6.1%2C5.2%2C8.9-0.5C2.4%2C10.6%2C4.5%2C10.8%2C6.6%2C11z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-9.5-9.7c3%2C0.8%2C3.7%2C2.3%2C1.1%2C4.4c-1.3%2C1-1.9%2C2.1-1.6%2C3.7c-4.4%2C1.1-6%2C3.6-3.5%2C6.3c4%2C4.4-1%2C4.2-2.4%2C4.9%0A%09%09%09c-1.6%2C0.8-4.4-1.2-5.2%2C2.2c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3%0A%09%09%09c-1.2-0.8-2.5-1.5-3.3-2.8c0.1-1.7%2C1.3-1.9%2C2.6-1.9c0.8%2C3.4%2C4.3%2C3.2%2C6.5%2C4.6c1.3%2C0.9%2C1.5-1.1%2C1.5-2.3c1.3-0.1%2C2.7-0.4%2C3.8%2C0.6%0A%09%09%09c0.8%2C0.7%2C1.7%2C2.3%2C2.8%2C0.6c0.9-1.3-0.5-2.1-1.3-2.9c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5%0A%09%09%09c-2.4%2C0.4-4.7-0.3-7-0.7c-0.8-0.1-1.5-0.5-1.5-1.3c0-1%2C0.9-0.9%2C1.6-1.2c1.6-0.7%2C4.9%2C2.5%2C4.6-1.5c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09%09c-0.8-1-2.7-0.8-2.8-2.6c2.1-1.8%2C7.5-1.3%2C9.4%2C1.3c2%2C2.7%2C4.2%2C3.7%2C7.5%2C3.4c2.6-0.3%2C4.9%2C1.8%2C7.1%2C2.9c3.4%2C1.7%2C7.5%2C1.6%2C10.5%2C4.3%0A%09%09%09c1.3%2C1.2%2C3.1%2C0.6%2C4.7%2C0.6C-13.7-6.9-12.1-6.8-9.5-9.7z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-16.5c-0.7%2C1-2.6%2C0.9-2.5%2C2.7c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1%0A%09%09%09c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.7-3%2C4.9-4.9%2C7.7-3.3c3.2%2C1.8%2C4.2-0.2%2C4.9-2.8c1-0.3%2C2.1-0.6%2C0.8-1.8c0.4-2.1%2C1.1-3.5%2C3.5-2%0A%09%09%09C-18.5-25-17.3-20.6-14.4-16.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-36.9-37.9c4.2-0.5%2C3.5%2C3.5%2C5.7%2C5.9c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4%0A%09%09%09c-0.7-1.1-4.1-2.1-1.9-3.1c3-1.4%2C6-5.3%2C10.1-2.6c1.3%2C0.8%2C0.2%2C1.4-0.7%2C1.7c-1%2C0.2-2.6-0.3-2.8%2C0.8C-40.1-38.9-38-38.7-36.9-37.9z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-30.6%2C19.1c0.1-1.1%2C0.3-2.2%2C1.6-2.4c1.3-0.2%2C1.7%2C0.9%2C2.2%2C1.8c0.6%2C1%2C0.6%2C2-0.5%2C2.7c-4.1%2C2.8-0.4%2C3.2%2C1.3%2C3.8%0A%09%09%09c1.4%2C0.5%2C3.3%2C0.2%2C2.6%2C2.4c-0.6%2C1.8-2.9%2C1.7-3.7%2C0.8c-2.3-2.4-7.8-1.8-7-7.2C-32.5%2C21.1-31.2%2C20.7-30.6%2C19.1z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-34.5c-5.3%2C0.5-10.5%2C0.9-15-2.5c4.1-1.7%2C8.5-1.6%2C12.9-1.8c0.2%2C1.1%2C0.8%2C1.6%2C1.9%2C1.7l0%2C0%0A%09%09%09C-14.5-36.3-14.4-35.4-14.4-34.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.5%2C42.6c-0.9-0.1-1.8-0.3-2.3-1.1c-1.7-2.9-3-6.4-7.5-3.1c-1%2C0.7-2.3-0.5-2.5-1.8%0A%09%09%09c-0.3-1.6%2C1.2-1.4%2C2.1-1.6c6.1-0.8%2C12-3.3%2C18.3-0.9c0.6%2C0.2%2C1.6%2C0%2C1.7%2C1c0.1%2C1.1-0.9%2C1.4-1.7%2C1.6c-0.4%2C0.1-0.9%2C0.1-1.3%2C0.2%0A%09%09%09c-1.3%2C0.3-3.7-0.5-3.7%2C1.4c0%2C2.2%2C2.6%2C1.8%2C4.2%2C2.2c1.9%2C0.4%2C4.9-1.3%2C5.5%2C1.3c0.5%2C2.4-2.9%2C1.8-4.4%2C2.8c-0.8%2C0.6-1.8%2C1-2.7%2C1.4%0A%09%09%09c-0.2-1.4%2C1.6-3.1-0.2-4C43.2%2C41%2C41.1%2C41.1%2C39.5%2C42.6z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39-3.9c-0.1%2C0.3-0.2%2C0.7-0.1%2C1.2c0.4%2C2.4%2C2.3%2C5%2C4.7%2C4.5c4.8-1%2C3.9%2C2.1%2C4.2%2C4.6c2.5%2C1.3%2C4.5%2C3.4%2C6.9%2C4.8%0A%09%09c0.1%2C0.7%2C0.2%2C1.4%2C0.3%2C2.1C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5C36.6-3.5%2C37.8-3.8%2C39-3.9z%22%0A%09%09%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M20.1-17.6c-0.7%2C0.5-1.7%2C0.9-1.4%2C2c0.4%2C1.1%2C1.5%2C0.7%2C2.3%2C0.8c2.8%2C0.3%2C6-0.8%2C8%2C2.3c1.8%2C0.2%2C2.6%2C1.6%2C2.7%2C3.1%0A%09%09c0.2%2C4%2C2.4%2C3.8%2C5.1%2C2.7c0.6-0.2%2C1.1-0.5%2C1.6-0.7c-1.2%2C0.6-2.4%2C1.2-3.6%2C1.7c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1%0A%09%09c-2-3.1-5.2-2-8-2.3c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c0.9-0.7%2C1.8-1.1%2C2.7-1.5C20.6-17.9%2C20.3-17.7%2C20.1-17.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M7%2C0.3c2.2%2C5%2C6.7%2C6.2%2C10.4%2C8.2c5.4%2C2.9%2C9.2%2C8.5%2C15.8%2C9.1c1.1%2C0.1%2C1.8%2C1.5%2C1.8%2C2.8c0.1%2C3.4%2C2.9%2C4.5%2C5.3%2C4.2%0A%09%09c3.5-0.3%2C6.9-1.4%2C10.2-2.5c-0.2%2C0.2-0.4%2C0.4-0.9%2C0.6c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2c-0.1-1.3-0.7-2.7-1.8-2.8%0A%09%09c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.4-2.2%2C4-3%2C6.2-3.3C6-2.6%2C6.2-1.5%2C7%2C0.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-17.7-45.7c-0.2%2C1.4%2C1.5%2C2.1%2C2.9%2C2.2c3.2%2C0.2%2C5.4%2C1.9%2C7.3%2C4.3c1.6%2C2.1%2C0.4%2C2.4-1.2%2C2.6c0-0.4-0.2-0.9-0.8-1.6%0A%09%09c-1.9-2.5-4.1-4.2-7.3-4.3c-1.4-0.1-3.1-0.8-2.9-2.2C-19.5-46.1-18.6-46-17.7-45.7C-17.7-45.7-17.7-45.7-17.7-45.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-13-31c0%2C0-0.1%2C0-0.1%2C0.1c1.9%2C3.6%2C6.1%2C4.6%2C8.5%2C7.6c0.7-0.4%2C1.3-0.7%2C2.1-0.9c0.1%2C0.2%2C0.3%2C0.5%2C0.3%2C0.7%0A%09%09c-1.6%2C0-3.1%2C0.2-4.4%2C1.1c-2.4-3-6.6-4.1-8.5-7.6c0.6-0.3%2C1.2-0.7%2C1.7-1C-13.2-31-13.1-31-13-31z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M15.3-25.2c0.8%2C2.2%2C2.6%2C2.6%2C4.6%2C2.4c0.3%2C0%2C0.6%2C0%2C0.9-0.1c-0.4%2C1-1.7%2C1-2.9%2C1.1c-2%2C0.2-3.8-0.2-4.6-2.4%0A%09%09c0.3-1.4%2C1.1-2.7%2C2.5-2.4C15.6-26.2%2C15.4-25.7%2C15.3-25.2z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M8.9-9.9c1%2C0.1%2C2.2%2C0.4%2C3.3%2C0.3c-1.3%2C1.7-3.5%2C0.8-5.3%2C0.7C5.4-9%2C6.2-10.5%2C6.5-11.4c0.6%2C0.1%2C1.1%2C0%2C1.7%2C0%0A%09%09C7.9-10.7%2C7.9-10%2C8.9-9.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M4.9%2C17.1c-0.5%2C0-1%2C0.1-1.5%2C0.2c1.1-0.7%2C2.4-1.3%2C3.5-1.2c3.6%2C0.3%2C1.2%2C3%2C1.3%2C4.7c1.2%2C0%2C3-0.1%2C3.1%2C1.1%0A%09%09c0.2%2C3.2%2C2.8%2C4.5%2C4.5%2C6.6c5.5%2C5.2%2C8.8%2C5.3%2C12.5%2C3.7c-4.6%2C2.5-8%2C3.4-14.5-2.7c-1.6-2.1-4.3-3.3-4.5-6.6c-0.1-1.2-1.9-1.1-3.1-1.1%0A%09%09C6.1%2C20.1%2C8.5%2C17.3%2C4.9%2C17.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4%2C13.8c2.7%2C3.3%2C7.3%2C3.5%2C10.5%2C6.3c0.8%2C0.7%2C2.6%2C2.5%2C4.5%2C2.4C-2.1%2C25-4.9%2C22.1-6%2C21.1%0A%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c0.3%2C0.1%2C0.6%2C0.1%2C0.9%2C0.1C-14.4%2C13-14.4%2C13.5-14.4%2C13.8z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-33.1-6.7c-0.1%2C0.2-0.2%2C0.5-0.2%2C0.9c0.8%2C1.3%2C2%2C2%2C3.3%2C2.8c1.4%2C0.9%2C1.5%2C1.8-0.3%2C2.3c0.1%2C4.3%2C3.9%2C4.5%2C6.6%2C6%0A%09%09c2.1%2C0.3%2C1.9%2C2%2C1.8%2C3.4c-0.1%2C1.2%2C0.5%2C1.7%2C1.2%2C2c-0.2%2C0.3-0.3%2C0.6-0.4%2C1.1c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4%0A%09%09c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3c-1.2-0.8-2.5-1.5-3.3-2.8C-35.2-6.3-34.3-6.6-33.1-6.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.2-21.1c3.8-0.7%2C6%2C1.9%2C6.2%2C4.7c0.2%2C2.2-0.8%2C2.2-2%2C1.8c0-0.2%2C0-0.5%2C0-0.8c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09c-0.8-1-2.7-0.8-2.8-2.6c0.5-0.4%2C1.2-0.7%2C2-0.9C-52.8-21.9-51-22.1-50.2-21.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.6-13.9c0.1-0.1%2C0.3-0.1%2C0.5-0.1c0%2C0.1%2C0%2C0.2%2C0%2C0.3c0%2C0.8%2C0.8%2C1.2%2C1.5%2C1.3c2.3%2C0.4%2C4.6%2C1.1%2C7%2C0.7%0A%09%09c2.5-1.1%2C5-2.4%2C6.3%2C1.5c0.9%2C0.1%2C2%2C0.6%2C2.6%2C0.2c5.4-2.9%2C10.6-2%2C15.4%2C2.9c0.8%2C0.8%2C2.2%2C1.6%2C1.3%2C2.9c-0.7%2C1-1.2%2C0.8-1.7%2C0.4%0A%09%09c0.2-1-0.9-1.6-1.6-2.3c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5c-2.4%2C0.4-4.7-0.3-7-0.7%0A%09%09c-0.8-0.1-1.5-0.5-1.5-1.3C-52.2-13.7-51.3-13.6-50.6-13.9z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-31.7-21c-0.3%2C1.4%2C0.5%2C1.7%2C1.5%2C1.2c4.8-2.8%2C8%2C0.8%2C11.2%2C3.1c0.9%2C0.6%2C1.6%2C1.4%2C2.5%2C1.8%0A%09%09%09c-0.2%2C0.3-0.4%2C0.6-0.4%2C1.2c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.4-1.8%2C2-3.1%2C3.8-3.6%0A%09%09%09C-30.8-22.9-31.5-22-31.7-21z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-18.3-28.9c1.3%2C1.3%2C0.2%2C1.5-0.8%2C1.8c-0.5%2C2-1.2%2C3.6-3%2C3.5c0.4-0.6%2C0.7-1.5%2C1-2.5c1-0.3%2C2.1-0.6%2C0.8-1.8%0A%09%09%09c0.3-1.7%2C0.8-3%2C2.4-2.5C-18.1-30-18.3-29.5-18.3-28.9z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-44.5-41.5c-2.3%2C1%2C1.2%2C2%2C1.9%2C3.1c0.7%2C1.2%2C0.2%2C2.3%2C0.1%2C3.4c-0.3%2C2.1%2C0.7%2C4.1%2C2.8%2C3.3c2.5-1%2C5-1.2%2C7.8-1.3%0A%09%09c0.2%2C0.3%2C0.4%2C0.7%2C0.7%2C1c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4c-0.7-1.1-4.1-2.1-1.9-3.1%0A%09%09c1.8-0.8%2C3.6-2.5%2C5.6-3.2C-42.2-42.9-43.3-42-44.5-41.5z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-25.1%2C27.3c0.3%2C0.4%2C0.9%2C0.6%2C1.5%2C0.6c-0.8%2C1.4-2.7%2C1.2-3.5%2C0.4c-2.3-2.4-7.8-1.8-7-7.2c0.7%2C0%2C1.4-0.1%2C1.9-0.4%0A%09%09%09C-32.4%2C25.4-27.2%2C24.9-25.1%2C27.3z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-28.6%2C18.1c-0.5%2C1.3-1.4%2C1.7-2.5%2C1.9c0.2-0.2%2C0.4-0.5%2C0.5-0.9c0.1-1.1%2C0.3-2.2%2C1.6-2.4c0.3%2C0%2C0.5%2C0%2C0.7%2C0.1%0A%09%09%09C-28.5%2C17.2-28.5%2C17.7-28.6%2C18.1z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-35.3c0%2C0.3%2C0%2C0.5%2C0%2C0.8c-5.3%2C0.5-10.5%2C0.9-15-2.5c0.8-0.3%2C1.5-0.6%2C2.3-0.8%0A%09%09C-23.2-35.1-18.9-35-14.4-35.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.2%2C40.4c0.4%2C0.8%2C1.3%2C1%2C2.1%2C1.1c-0.6%2C0.2-1.2%2C0.5-1.8%2C1c-0.9-0.1-1.8-0.3-2.3-1.1c-1.4-2.3-2.5-5-5.1-4.3%0A%09%09C36.3%2C34.2%2C37.5%2C37.6%2C39.2%2C40.4z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M46.9%2C40.9c1.8%2C0.9%2C0%2C2.6%2C0.2%2C4c-0.7%2C0.4-1.3%2C0.7-2%2C1c-0.2-1.4%2C1.6-3.1-0.2-4c-1-0.5-2.1-0.7-3.2-0.4%0A%09%09C43.3%2C40.1%2C45.2%2C40%2C46.9%2C40.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M29.2%2C35.5c0.2%2C1%2C1%2C1.9%2C1.7%2C2c-0.4%2C0.2-0.8%2C0.5-1.2%2C0.8c-1%2C0.7-2.3-0.5-2.5-1.8c-0.3-1.6%2C1-1.5%2C2-1.6%0A%09%09C29.2%2C35.1%2C29.2%2C35.3%2C29.2%2C35.5z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_28%22%20viewBox%3D%22-4.7%20-2.5%209.4%205%22%3E%0A%0A%09%09%3Cellipse%20transform%3D%22matrix%280.3883%20-0.9215%200.9215%200.3883%201.676236e-12%20-1.112622e-12%29%22%20class%3D%22st2%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%221.7%22%20ry%3D%225.1%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_81%22%20viewBox%3D%22-8%20-9.6%2016%2014.9%22%3E%0A%09%3Cpath%20class%3D%22st3%22%20d%3D%22M-2.6-9.6c-2.1%2C0.1-4%2C1.7-4.9%2C3.8c-0.8%2C1.9-0.7%2C4.6%2C1.7%2C6.4c3.1%2C2.3%2C7%2C3.3%2C9.8%2C3.6c0.1%2C0.1%2C0.3%2C0.3%2C0.4%2C0.4%0A%09%09C4.8%2C4.9%2C5.3%2C5.1%2C5.7%2C5c0.6%2C0%2C1.1-0.3%2C1.6-0.8c0.1%2C0%2C0.1-0.1%2C0.1-0.2C7.5%2C4%2C7.5%2C4%2C7.6%2C3.9C7.9%2C3.4%2C8%2C2.9%2C8%2C2.4C8%2C2%2C7.8%2C1.3%2C7.2%2C0.8%0A%09%09C7.1%2C0.8%2C6.9%2C0.7%2C6.8%2C0.6c-1-2.9-2.9-6.8-6.1-9.1C-0.3-9.3-1.5-9.7-2.6-9.6C-2.6-9.6-2.6-9.6-2.6-9.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st4%22%20d%3D%22M6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6c-0.5%2C0.6-1.3%2C0.9-2%2C0.3C4.6%2C4.8%2C4.4%2C4.6%2C4.3%2C4.5%0A%09%09C1.7%2C4.1-2.4%2C3.2-5.5%2C0.9c-4.9-3.7%2C0.7-11.5%2C5.6-7.7c3.2%2C2.4%2C5%2C6.5%2C5.9%2C9c0.2%2C0.1%2C0.3%2C0.2%2C0.5%2C0.3C7.3%2C3.1%2C7.2%2C4%2C6.8%2C4.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st5%22%20d%3D%22M4.6%2C3.4c0%2C0-1.5-4.2-5.3-6.8s-6.7%2C1.9-3%2C4.4S4.6%2C3.4%2C4.6%2C3.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_82%22%20viewBox%3D%22-6.4%20-7.4%2012.7%2014.7%22%3E%0A%09%3Cpath%20class%3D%22st6%22%20d%3D%22M-1.7%2C6.4c2.2-2%2C5.9%2C3.5%2C6.3-0.7c0.3-2.6%2C3.7-6%2C0.3-8.5c-2.8-2-6-4.4-9.2-4.6c-3-0.2-2.1%2C3.1-0.8%2C4.8%0A%09%09c1.6%2C2.1%2C6.7%2C3.6%2C0.5%2C6.4C-4.9%2C4-5%2C5.6-4.6%2C6.3C-3.7%2C8.2-2.6%2C7-1.7%2C6.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_83%22%20viewBox%3D%22-21.4%20-11%2042.8%2021.9%22%3E%0A%09%3Cellipse%20class%3D%22st7%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2221.4%22%20ry%3D%2211%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22middle%22%20viewBox%3D%22-9.3%20-9.3%2018.7%2018.7%22%3E%0A%09%3Ccircle%20class%3D%22st8%22%20cx%3D%220%22%20cy%3D%220%22%20r%3D%229.3%22%2F%3E%0A%09%3Ccircle%20class%3D%22st9%22%20cx%3D%22-2.7%22%20cy%3D%222.2%22%20r%3D%224.8%22%2F%3E%0A%09%3Ccircle%20class%3D%22st10%22%20cx%3D%22-3.7%22%20cy%3D%223.2%22%20r%3D%222.5%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone3%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_1_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.205665e-02%22%20style%3D%22stop-color%3A%23F7F4F1%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%23CDBCB3%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st11%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_2_%22%20cx%3D%22-7.4167%22%20cy%3D%2211.5833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.9817%20-0.1905%200.11%200.5668%20-1.4098%203.6055%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.2125%22%20style%3D%22stop-color%3A%23FFFFFF%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8374%22%20style%3D%22stop-color%3A%23FFFFFF%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st12%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_3_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1019%22%20style%3D%22stop-color%3A%23C19377%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%23C19377%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st13%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone4%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_4_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%222.963362e-02%22%20style%3D%22stop-color%3A%2398A6B2%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.2213%22%20style%3D%22stop-color%3A%238B9BA9%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7139%22%20style%3D%22stop-color%3A%236F8295%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%2365798D%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st14%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_5_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1609%22%20style%3D%22stop-color%3A%23254058%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4016%22%20style%3D%22stop-color%3A%23354E65%3Bstop-opacity%3A0.8176%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4664%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0.7686%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st15%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_6_%22%20cx%3D%22-10.9167%22%20cy%3D%2214.0833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.997%207.794188e-02%20-4.499866e-02%200.5756%200.6005%206.8281%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1287%22%20style%3D%22stop-color%3A%23DAE4EA%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.3452%22%20style%3D%22stop-color%3A%23D1DBE1%3Bstop-opacity%3A0.6859%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8178%22%20style%3D%22stop-color%3A%23C1CCD2%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st16%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22%D1%8B%D0%B5%D1%89%D1%82%D1%831%22%20viewBox%3D%22-38%20-28.5%2076%2057%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_7_%22%20cx%3D%22-9.75%22%20cy%3D%2213.4167%22%20r%3D%2256.4377%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%202.2799%2010.1643%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%225.041564e-03%22%20style%3D%22stop-color%3A%23ABDF93%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.1414%22%20style%3D%22stop-color%3A%239BCC84%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4983%22%20style%3D%22stop-color%3A%2374A060%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.679%22%20style%3D%22stop-color%3A%23658F52%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st17%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_8_%22%20cx%3D%225.75%22%20cy%3D%22-6.5833%22%20r%3D%2232.95%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%20-1.0393%20-5.3709%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.321%22%20style%3D%22stop-color%3A%234D8035%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.995%22%20style%3D%22stop-color%3A%234D8035%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st18%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_9_%22%20cx%3D%22-9%22%20cy%3D%2213.75%22%20r%3D%2222.0482%22%20gradientTransform%3D%22matrix%280.9129%200.4081%20-0.1887%200.4221%201.8107%2011.6196%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.891172e-02%22%20style%3D%22stop-color%3A%23D7FFC5%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7851%22%20style%3D%22stop-color%3A%23D7FFC5%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st19%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_10_%22%20cx%3D%2234%22%20cy%3D%22-16.3333%22%20r%3D%2261.6988%22%20gradientTransform%3D%22matrix%280.9725%200.2331%20-0.1028%200.4289%20-0.7427%20-17.2516%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220%22%20style%3D%22stop-color%3A%23C1FDAC%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.6442%22%20style%3D%22stop-color%3A%238DB970%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st20%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_2%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_10%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_11%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_12%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_3%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_1%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st27%22%20d%3D%22M171%2C8.2c-1.6-1.4-3.7-2.2-5.9-2.2c-1.9%2C0-3.7%2C0.6-5.3%2C1.7l-1.6%2C1.4c-12.8%2C11.7-29.9%2C19.8-48.5%2C23.2%0A%09%09%09c-3.8-7.1-11.4-12-20-12c-8.6%2C0-16.1%2C4.8-20%2C11.9c-13.8-2.6-26.8-7.7-37.8-15.1c3.3-1.3%2C5.6-4.5%2C5.6-8.3c0-4.9-4-8.9-8.9-8.9%0A%09%09%09L8.7%2C0c-0.5%2C0-1%2C0.1-1.5%2C0.2C7%2C0.2%2C6.9%2C0.2%2C6.8%2C0.3C6.4%2C0.4%2C6%2C0.5%2C5.5%2C0.7c-0.1%2C0-0.2%2C0.1-0.2%2C0.1C4.8%2C1%2C4.4%2C1.2%2C4%2C1.5L3.8%2C1.6%0A%09%09%09C3.6%2C1.8%2C3.3%2C2%2C3.1%2C2.2C2.9%2C2.4%2C2.7%2C2.6%2C2.5%2C2.7C0.8%2C4.5-0.1%2C6.9%2C0%2C9.5l0%2C19.2c0%2C4.9%2C4%2C8.9%2C8.9%2C8.9c4.7%2C0%2C8.6-3.7%2C8.9-8.4%0A%09%09%09C32%2C39.6%2C49.6%2C47%2C68%2C50.2C71%2C59.4%2C79.6%2C66%2C89.7%2C66c10.1%2C0%2C18.6-6.6%2C21.6-15.7c22.8-3.9%2C43.8-13.8%2C59.5-28.4l0.4-0.4%0A%09%09%09c0.2-0.2%2C0.4-0.4%2C0.6-0.6C175%2C17.1%2C174.7%2C11.5%2C171%2C8.2z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M170%2C9.4c-1.4-1.2-3.1-1.8-4.9-1.8c-1.6%2C0-3.1%2C0.5-4.4%2C1.4l-0.6%2C0.5c-0.1%2C0.1-0.3%2C0.3-0.4%2C0.4l-0.4%2C0.4%0A%09%09%09C146%2C22.4%2C128.3%2C30.8%2C109%2C34.1c-3.4-7.2-10.8-12.3-19.3-12.3c-8.5%2C0-15.8%2C5-19.2%2C12.2C54.8%2C31.2%2C40%2C25.1%2C28.1%2C16.4h0.5%0A%09%09%09c4.1%2C0%2C7.4-3.3%2C7.4-7.4c0-4.1-3.3-7.4-7.4-7.4l-19.9%2C0c-0.4%2C0-0.8%2C0.1-1.2%2C0.1c-0.1%2C0-0.2%2C0.1-0.3%2C0.1C6.8%2C1.8%2C6.5%2C1.9%2C6.1%2C2.1%0A%09%09%09C6%2C2.1%2C5.9%2C2.1%2C5.9%2C2.2C5.5%2C2.3%2C5.2%2C2.5%2C4.8%2C2.8L4.7%2C2.9C4.5%2C3%2C4.2%2C3.2%2C4%2C3.3C3.9%2C3.5%2C3.7%2C3.6%2C3.6%2C3.7C2.2%2C5.2%2C1.4%2C7.3%2C1.5%2C9.4%0A%09%09%09l0%2C19.2c0%2C4.1%2C3.3%2C7.4%2C7.4%2C7.4s7.4-3.3%2C7.4-7.4v-2.5c14.6%2C11.5%2C33%2C19.4%2C52.7%2C22.7c2.5%2C9.1%2C10.8%2C15.8%2C20.6%2C15.8%0A%09%09%09c9.8%2C0%2C18.1-6.6%2C20.6-15.7c22.8-3.7%2C43.8-13.6%2C59.5-28.1l0.4-0.4c0.2-0.2%2C0.4-0.4%2C0.5-0.6C173.4%2C16.8%2C173.1%2C12.1%2C170%2C9.4z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st28%22%20d%3D%22M168.7%2C10.9c-1-0.9-2.3-1.3-3.6-1.3c-1.2%2C0-2.3%2C0.4-3.2%2C1.1c-0.4%2C0.4-0.7%2C0.7-1.1%2C1.1c0%2C0-0.1%2C0.1-0.1%2C0.1%0A%09%09%09l0%2C0c-13.7%2C12.6-32.4%2C21.3-52.7%2C24.5c-2.8-7.4-9.9-12.6-18.2-12.6c-8.3%2C0-15.4%2C5.2-18.2%2C12.5c-18.6-3.1-35.9-10.7-49.2-21.8h6.4%0A%09%09%09c3%2C0%2C5.4-2.4%2C5.4-5.4c0-3-2.4-5.4-5.4-5.4l-19.8%2C0c-0.3%2C0-0.6%2C0-0.9%2C0.1c-0.1%2C0-0.2%2C0-0.2%2C0.1C7.4%2C3.7%2C7.1%2C3.8%2C6.9%2C3.9%0A%09%09%09C6.8%2C3.9%2C6.8%2C4%2C6.7%2C4C6.5%2C4.1%2C6.2%2C4.3%2C5.9%2C4.4L5.8%2C4.5C5.6%2C4.6%2C5.5%2C4.7%2C5.3%2C4.9C5.3%2C4.9%2C5.2%2C5%2C5.1%2C5.1L5.1%2C5.1%0A%09%09%09C4%2C6.2%2C3.4%2C7.8%2C3.5%2C9.4l0%2C19.3c0%2C3%2C2.4%2C5.4%2C5.4%2C5.4c3%2C0%2C5.4-2.4%2C5.4-5.4v-6.7c15.1%2C13%2C34.9%2C21.8%2C56.2%2C25.1%0A%09%09%09c1.8%2C8.9%2C9.7%2C15.7%2C19.1%2C15.7c9.4%2C0%2C17.3-6.7%2C19.1-15.6c23-3.5%2C44.1-13.4%2C59.6-27.7c0.3-0.3%2C0.5-0.6%2C0.8-0.9%0A%09%09%09C171.1%2C16.3%2C170.9%2C12.8%2C168.7%2C10.9z%22%2F%3E%0A%09%09%3Cg%3E%0A%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M103.7%2C40.2L103.7%2C40.2c-1.6-1.5-4.7-4.2-6.7-5.9c-0.9-0.7-1.9-1.2-2.9-1.5c-0.8-0.2-1.7-0.2-2.6%2C0%0A%09%09%09%09c-0.7%2C0.1-1.3%2C0.4-1.8%2C0.6c-0.5-0.2-1.1-0.4-1.8-0.6c-0.9-0.2-1.8-0.2-2.6%2C0c-1.1%2C0.2-2.1%2C0.7-2.9%2C1.5c-2%2C1.7-5%2C4.4-6.7%2C5.9%0A%09%09%09%09c-1.2%2C1.1-1.5%2C2.9-0.7%2C4.3c1.3%2C2.3%2C2.7%2C4.1%2C4.3%2C5.5c1.2%2C1.1%2C2.5%2C2%2C3.9%2C2.6c1.7%2C0.7%2C3.4%2C1.1%2C5.3%2C1.1H91c1.8%2C0%2C3.6-0.4%2C5.3-1.1%0A%09%09%09%09c1.4-0.6%2C2.7-1.5%2C3.9-2.6c1.6-1.4%2C3-3.3%2C4.3-5.5C105.2%2C43.1%2C104.9%2C41.3%2C103.7%2C40.2z%22%2F%3E%0A%09%09%09%3Cpath%20class%3D%22st29%22%20d%3D%22M102.4%2C41.7c-1.5-1.4-4.6-4.2-6.6-5.9C93%2C33.4%2C90%2C35.4%2C90%2C35.4s-0.2%2C0.1-0.3%2C0.1s-0.3-0.1-0.3-0.1%0A%09%09%09%09s-3.1-2-5.8%2C0.3c-2%2C1.7-5.1%2C4.5-6.6%2C5.9c-0.5%2C0.5-0.7%2C1.3-0.3%2C1.9c1.4%2C2.5%2C5%2C8.3%2C11.7%2C8.3c0.3%2C0%2C2.3%2C0%2C2.6%2C0%0A%09%09%09%09c6.7%2C0%2C10.4-5.8%2C11.7-8.3C103.1%2C42.9%2C102.9%2C42.1%2C102.4%2C41.7z%22%2F%3E%0A%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M97%2C42.7c-0.1-0.7-6.6-0.6-7.3-0.6c-0.7%2C0-7.2-0.1-7.3%2C0.6c-0.1%2C0.7%2C2.8%2C2.7%2C7.3%2C2.7%0A%09%09%09%09C94.3%2C45.3%2C97.1%2C43.4%2C97%2C42.7z%22%2F%3E%0A%09%09%3C%2Fg%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_8%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_9%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_4%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_5%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_6%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_7%22%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
	"ui_arrow_kiss_up.svg": "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2022.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%20%20%20%20%20width%3D%22174%22%20height%3D%2266%22%0A%09%20viewBox%3D%220%200%20174%2066%22%20style%3D%22enable-background%3Anew%200%200%20174%2066%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%09.st0%7Bopacity%3A0.9%3B%7D%0A%09.st1%7Bfill%3A%23FF833F%3B%7D%0A%09.st2%7Bfill%3A%23EBF2DC%3B%7D%0A%09.st3%7Bopacity%3A0.4%3Bfill%3A%23D45F26%3B%7D%0A%09.st4%7Bfill%3A%23FFC449%3B%7D%0A%09.st5%7Bfill%3A%23FCD578%3B%7D%0A%09.st6%7Bfill%3A%23C26934%3B%7D%0A%09.st7%7Bfill%3A%23F9AA18%3B%7D%0A%09.st8%7Bfill%3A%23D61A3D%3B%7D%0A%09.st9%7Bfill%3A%23EE3457%3B%7D%0A%09.st10%7Bfill%3A%23FF8097%3B%7D%0A%09.st11%7Bfill%3Aurl%28%23SVGID_1_%29%3B%7D%0A%09.st12%7Bfill%3Aurl%28%23SVGID_2_%29%3B%7D%0A%09.st13%7Bfill%3Aurl%28%23SVGID_3_%29%3B%7D%0A%09.st14%7Bfill%3Aurl%28%23SVGID_4_%29%3B%7D%0A%09.st15%7Bfill%3Aurl%28%23SVGID_5_%29%3B%7D%0A%09.st16%7Bfill%3Aurl%28%23SVGID_6_%29%3B%7D%0A%09.st17%7Bfill%3Aurl%28%23SVGID_7_%29%3B%7D%0A%09.st18%7Bfill%3Aurl%28%23SVGID_8_%29%3B%7D%0A%09.st19%7Bfill%3Aurl%28%23SVGID_9_%29%3B%7D%0A%09.st20%7Bfill%3Aurl%28%23SVGID_10_%29%3B%7D%0A%09.st21%7Bfill%3A%23FFFFFF%3B%7D%0A%09.st22%7Bfill%3A%23FF6100%3B%7D%0A%09.st23%7Bopacity%3A0.8%3Bfill%3Aurl%28%23SVGID_11_%29%3B%7D%0A%09.st24%7Bfill%3Aurl%28%23SVGID_12_%29%3B%7D%0A%09.st25%7Bfill%3A%23E0B993%3B%7D%0A%09.st26%7Bfill%3Anone%3Bstroke%3A%23FFFFFF%3Bstroke-width%3A2%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A10%3B%7D%0A%09.st27%7Bopacity%3A0.15%3Bfill%3A%23020202%3B%7D%0A%09.st28%7Bfill%3A%239BCC33%3B%7D%0A%09.st29%7Bfill%3A%23E03D1F%3B%7D%0A%3C%2Fstyle%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_26%22%20viewBox%3D%22-55%20-45.9%20110.1%2091.8%22%3E%0A%09%3Cg%20class%3D%22st0%22%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M42.8-18.5c-0.1%2C2.1%2C0.7%2C3.6%2C2.2%2C5.1c1.7%2C1.6%2C4.1%2C3.6%2C4.2%2C5.5c0.3%2C7.6%2C5.2%2C13.7%2C5.8%2C21.1%0A%09%09%09C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5c-0.4-2.4%2C2-2.1%2C3.5-2.3c1.8-0.2%2C2.3-1.3%2C1.9-2.8%0A%09%09%09c-0.5-2-1.8-1.5-3.1-0.9c-1.5%2C0.7-2.9%2C1.5-4.4%2C2.1c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1c-2-3.1-5.2-2-8-2.3%0A%09%09%09c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c3.7-2.8%2C7.8-2.4%2C11.9-1.4c4%2C0.9%2C8%2C2.1%2C11.8-0.5C42.2-18.5%2C42.5-18.5%2C42.8-18.5z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M49.2%2C20.6c1.8%2C0.4%2C2.1%2C1.7%2C0.6%2C2.2c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2%0A%09%09%09c-0.1-1.3-0.7-2.7-1.8-2.8c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.1-2.9%2C4.3-3.3%2C7.8-3.3c2.5%2C1.8%2C5.1%2C0.6%2C7.1-0.5%0A%09%09%09C18.7-6%2C22.5-6%2C26.4-5.2c1.9%2C5%2C1.4%2C5.6-3.9%2C5c-1.6-0.2-3.2-0.1-4.9-0.3c-1.2-0.1-2.6-0.7-2.9%2C0.9c-0.3%2C1.4%2C1.5%2C1%2C2.2%2C1.6%0A%09%09%09c4.4%2C4.1%2C11.8%2C1.7%2C15.6%2C7.5c1.2%2C1.8%2C3.1%2C3%2C2.5%2C5.6c-0.4%2C1.8%2C0.9%2C2.3%2C2.3%2C2.4C40.4%2C22.3%2C45.1%2C20.2%2C49.2%2C20.6z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-15.1-30c0.6-0.3%2C1.2-0.7%2C1.7-1c2.8-0.4%2C2.5-2.6%2C2.5-4.6c1.7-0.2%2C3.1-0.4%2C1.4-2.6c-1.9-2.5-4.1-4.2-7.3-4.3%0A%09%09%09c-1.4-0.1-3.1-0.8-2.9-2.2c0.2-2%2C2-0.9%2C3.2-0.8C-11-45.2-5.8-43-0.3-43.1c0.9%2C0%2C1.9%2C0.3%2C2%2C1.4c0.1%2C1-0.8%2C1-1.5%2C1.2%0A%09%09%09C-4.4-39.7-2.6-38-0.6-36c1.7%2C1.6%2C3.5%2C2.8%2C5.9%2C2.3c0%2C1.5%2C0.2%2C3%2C1.1%2C4.4c-4%2C3.9-5%2C3.7-7.6-0.8c-1.1-1.9-3-2.9-4.9-1.8%0A%09%09%09c-2.2%2C1.3%2C0.2%2C2.7%2C0.4%2C4c0.3%2C2.3%2C2.9%2C2.5%2C3.4%2C4.4c-1.6%2C0-3.1%2C0.2-4.4%2C1.1C-9-25.4-13.2-26.4-15.1-30z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M13.3-24.2c0.3-1.5%2C1.1-2.7%2C2.6-2.4c1.8%2C0.4%2C4.5-0.3%2C4.9%2C2.6c0.3%2C2.2-1.5%2C2.1-3%2C2.2%0A%09%09%09C15.9-21.6%2C14.1-22%2C13.3-24.2z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M12.8-10.8c-1.1%2C3.2-3.8%2C1.9-5.9%2C1.8C5.4-9%2C6.2-10.5%2C6.5-11.4C8.6-11.2%2C10.8-12.3%2C12.8-10.8z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M6.6%2C11c2.3-0.3%2C5-1.9%2C5.8%2C2.2c0.3%2C1.4%2C2%2C0.9%2C3.1%2C1.3c1.6%2C0.6%2C4.1%2C0.6%2C4.2%2C2.7c0.1%2C2.3-2.9%2C0.6-4.6%2C3.1%0A%09%09%09c4.7-1.8%2C7.3%2C3.7%2C11.9%2C1.1c2.1-1.2%2C3.8%2C1.2%2C4.1%2C2.9c0.5%2C2.4%2C1.7%2C5.2-1.6%2C7.1c-5.3%2C3-8.7%2C4.7-15.8-1.9c-1.6-2.1-4.3-3.3-4.5-6.6%0A%09%09%09c-0.1-1.2-1.9-1.1-3.1-1.1c-0.2-1.7%2C2.3-4.4-1.3-4.7c-1.6-0.1-3.6%2C1.2-5%2C2.3c-1.4%2C1.1-0.8%2C2.3%2C1%2C2.7c-2.7%2C3.3-5.7%2C0.1-6.9-0.9%0A%09%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c2.7%2C0.8%2C4.4-1.7%2C6.7-1.6l0%2C0c4.7%2C5.3%2C6.1%2C5.2%2C8.9-0.5C2.4%2C10.6%2C4.5%2C10.8%2C6.6%2C11z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-9.5-9.7c3%2C0.8%2C3.7%2C2.3%2C1.1%2C4.4c-1.3%2C1-1.9%2C2.1-1.6%2C3.7c-4.4%2C1.1-6%2C3.6-3.5%2C6.3c4%2C4.4-1%2C4.2-2.4%2C4.9%0A%09%09%09c-1.6%2C0.8-4.4-1.2-5.2%2C2.2c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3%0A%09%09%09c-1.2-0.8-2.5-1.5-3.3-2.8c0.1-1.7%2C1.3-1.9%2C2.6-1.9c0.8%2C3.4%2C4.3%2C3.2%2C6.5%2C4.6c1.3%2C0.9%2C1.5-1.1%2C1.5-2.3c1.3-0.1%2C2.7-0.4%2C3.8%2C0.6%0A%09%09%09c0.8%2C0.7%2C1.7%2C2.3%2C2.8%2C0.6c0.9-1.3-0.5-2.1-1.3-2.9c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5%0A%09%09%09c-2.4%2C0.4-4.7-0.3-7-0.7c-0.8-0.1-1.5-0.5-1.5-1.3c0-1%2C0.9-0.9%2C1.6-1.2c1.6-0.7%2C4.9%2C2.5%2C4.6-1.5c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09%09c-0.8-1-2.7-0.8-2.8-2.6c2.1-1.8%2C7.5-1.3%2C9.4%2C1.3c2%2C2.7%2C4.2%2C3.7%2C7.5%2C3.4c2.6-0.3%2C4.9%2C1.8%2C7.1%2C2.9c3.4%2C1.7%2C7.5%2C1.6%2C10.5%2C4.3%0A%09%09%09c1.3%2C1.2%2C3.1%2C0.6%2C4.7%2C0.6C-13.7-6.9-12.1-6.8-9.5-9.7z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-16.5c-0.7%2C1-2.6%2C0.9-2.5%2C2.7c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1%0A%09%09%09c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.7-3%2C4.9-4.9%2C7.7-3.3c3.2%2C1.8%2C4.2-0.2%2C4.9-2.8c1-0.3%2C2.1-0.6%2C0.8-1.8c0.4-2.1%2C1.1-3.5%2C3.5-2%0A%09%09%09C-18.5-25-17.3-20.6-14.4-16.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-36.9-37.9c4.2-0.5%2C3.5%2C3.5%2C5.7%2C5.9c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4%0A%09%09%09c-0.7-1.1-4.1-2.1-1.9-3.1c3-1.4%2C6-5.3%2C10.1-2.6c1.3%2C0.8%2C0.2%2C1.4-0.7%2C1.7c-1%2C0.2-2.6-0.3-2.8%2C0.8C-40.1-38.9-38-38.7-36.9-37.9z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-30.6%2C19.1c0.1-1.1%2C0.3-2.2%2C1.6-2.4c1.3-0.2%2C1.7%2C0.9%2C2.2%2C1.8c0.6%2C1%2C0.6%2C2-0.5%2C2.7c-4.1%2C2.8-0.4%2C3.2%2C1.3%2C3.8%0A%09%09%09c1.4%2C0.5%2C3.3%2C0.2%2C2.6%2C2.4c-0.6%2C1.8-2.9%2C1.7-3.7%2C0.8c-2.3-2.4-7.8-1.8-7-7.2C-32.5%2C21.1-31.2%2C20.7-30.6%2C19.1z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-34.5c-5.3%2C0.5-10.5%2C0.9-15-2.5c4.1-1.7%2C8.5-1.6%2C12.9-1.8c0.2%2C1.1%2C0.8%2C1.6%2C1.9%2C1.7l0%2C0%0A%09%09%09C-14.5-36.3-14.4-35.4-14.4-34.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.5%2C42.6c-0.9-0.1-1.8-0.3-2.3-1.1c-1.7-2.9-3-6.4-7.5-3.1c-1%2C0.7-2.3-0.5-2.5-1.8%0A%09%09%09c-0.3-1.6%2C1.2-1.4%2C2.1-1.6c6.1-0.8%2C12-3.3%2C18.3-0.9c0.6%2C0.2%2C1.6%2C0%2C1.7%2C1c0.1%2C1.1-0.9%2C1.4-1.7%2C1.6c-0.4%2C0.1-0.9%2C0.1-1.3%2C0.2%0A%09%09%09c-1.3%2C0.3-3.7-0.5-3.7%2C1.4c0%2C2.2%2C2.6%2C1.8%2C4.2%2C2.2c1.9%2C0.4%2C4.9-1.3%2C5.5%2C1.3c0.5%2C2.4-2.9%2C1.8-4.4%2C2.8c-0.8%2C0.6-1.8%2C1-2.7%2C1.4%0A%09%09%09c-0.2-1.4%2C1.6-3.1-0.2-4C43.2%2C41%2C41.1%2C41.1%2C39.5%2C42.6z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39-3.9c-0.1%2C0.3-0.2%2C0.7-0.1%2C1.2c0.4%2C2.4%2C2.3%2C5%2C4.7%2C4.5c4.8-1%2C3.9%2C2.1%2C4.2%2C4.6c2.5%2C1.3%2C4.5%2C3.4%2C6.9%2C4.8%0A%09%09c0.1%2C0.7%2C0.2%2C1.4%2C0.3%2C2.1C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5C36.6-3.5%2C37.8-3.8%2C39-3.9z%22%0A%09%09%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M20.1-17.6c-0.7%2C0.5-1.7%2C0.9-1.4%2C2c0.4%2C1.1%2C1.5%2C0.7%2C2.3%2C0.8c2.8%2C0.3%2C6-0.8%2C8%2C2.3c1.8%2C0.2%2C2.6%2C1.6%2C2.7%2C3.1%0A%09%09c0.2%2C4%2C2.4%2C3.8%2C5.1%2C2.7c0.6-0.2%2C1.1-0.5%2C1.6-0.7c-1.2%2C0.6-2.4%2C1.2-3.6%2C1.7c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1%0A%09%09c-2-3.1-5.2-2-8-2.3c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c0.9-0.7%2C1.8-1.1%2C2.7-1.5C20.6-17.9%2C20.3-17.7%2C20.1-17.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M7%2C0.3c2.2%2C5%2C6.7%2C6.2%2C10.4%2C8.2c5.4%2C2.9%2C9.2%2C8.5%2C15.8%2C9.1c1.1%2C0.1%2C1.8%2C1.5%2C1.8%2C2.8c0.1%2C3.4%2C2.9%2C4.5%2C5.3%2C4.2%0A%09%09c3.5-0.3%2C6.9-1.4%2C10.2-2.5c-0.2%2C0.2-0.4%2C0.4-0.9%2C0.6c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2c-0.1-1.3-0.7-2.7-1.8-2.8%0A%09%09c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.4-2.2%2C4-3%2C6.2-3.3C6-2.6%2C6.2-1.5%2C7%2C0.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-17.7-45.7c-0.2%2C1.4%2C1.5%2C2.1%2C2.9%2C2.2c3.2%2C0.2%2C5.4%2C1.9%2C7.3%2C4.3c1.6%2C2.1%2C0.4%2C2.4-1.2%2C2.6c0-0.4-0.2-0.9-0.8-1.6%0A%09%09c-1.9-2.5-4.1-4.2-7.3-4.3c-1.4-0.1-3.1-0.8-2.9-2.2C-19.5-46.1-18.6-46-17.7-45.7C-17.7-45.7-17.7-45.7-17.7-45.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-13-31c0%2C0-0.1%2C0-0.1%2C0.1c1.9%2C3.6%2C6.1%2C4.6%2C8.5%2C7.6c0.7-0.4%2C1.3-0.7%2C2.1-0.9c0.1%2C0.2%2C0.3%2C0.5%2C0.3%2C0.7%0A%09%09c-1.6%2C0-3.1%2C0.2-4.4%2C1.1c-2.4-3-6.6-4.1-8.5-7.6c0.6-0.3%2C1.2-0.7%2C1.7-1C-13.2-31-13.1-31-13-31z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M15.3-25.2c0.8%2C2.2%2C2.6%2C2.6%2C4.6%2C2.4c0.3%2C0%2C0.6%2C0%2C0.9-0.1c-0.4%2C1-1.7%2C1-2.9%2C1.1c-2%2C0.2-3.8-0.2-4.6-2.4%0A%09%09c0.3-1.4%2C1.1-2.7%2C2.5-2.4C15.6-26.2%2C15.4-25.7%2C15.3-25.2z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M8.9-9.9c1%2C0.1%2C2.2%2C0.4%2C3.3%2C0.3c-1.3%2C1.7-3.5%2C0.8-5.3%2C0.7C5.4-9%2C6.2-10.5%2C6.5-11.4c0.6%2C0.1%2C1.1%2C0%2C1.7%2C0%0A%09%09C7.9-10.7%2C7.9-10%2C8.9-9.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M4.9%2C17.1c-0.5%2C0-1%2C0.1-1.5%2C0.2c1.1-0.7%2C2.4-1.3%2C3.5-1.2c3.6%2C0.3%2C1.2%2C3%2C1.3%2C4.7c1.2%2C0%2C3-0.1%2C3.1%2C1.1%0A%09%09c0.2%2C3.2%2C2.8%2C4.5%2C4.5%2C6.6c5.5%2C5.2%2C8.8%2C5.3%2C12.5%2C3.7c-4.6%2C2.5-8%2C3.4-14.5-2.7c-1.6-2.1-4.3-3.3-4.5-6.6c-0.1-1.2-1.9-1.1-3.1-1.1%0A%09%09C6.1%2C20.1%2C8.5%2C17.3%2C4.9%2C17.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4%2C13.8c2.7%2C3.3%2C7.3%2C3.5%2C10.5%2C6.3c0.8%2C0.7%2C2.6%2C2.5%2C4.5%2C2.4C-2.1%2C25-4.9%2C22.1-6%2C21.1%0A%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c0.3%2C0.1%2C0.6%2C0.1%2C0.9%2C0.1C-14.4%2C13-14.4%2C13.5-14.4%2C13.8z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-33.1-6.7c-0.1%2C0.2-0.2%2C0.5-0.2%2C0.9c0.8%2C1.3%2C2%2C2%2C3.3%2C2.8c1.4%2C0.9%2C1.5%2C1.8-0.3%2C2.3c0.1%2C4.3%2C3.9%2C4.5%2C6.6%2C6%0A%09%09c2.1%2C0.3%2C1.9%2C2%2C1.8%2C3.4c-0.1%2C1.2%2C0.5%2C1.7%2C1.2%2C2c-0.2%2C0.3-0.3%2C0.6-0.4%2C1.1c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4%0A%09%09c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3c-1.2-0.8-2.5-1.5-3.3-2.8C-35.2-6.3-34.3-6.6-33.1-6.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.2-21.1c3.8-0.7%2C6%2C1.9%2C6.2%2C4.7c0.2%2C2.2-0.8%2C2.2-2%2C1.8c0-0.2%2C0-0.5%2C0-0.8c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09c-0.8-1-2.7-0.8-2.8-2.6c0.5-0.4%2C1.2-0.7%2C2-0.9C-52.8-21.9-51-22.1-50.2-21.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.6-13.9c0.1-0.1%2C0.3-0.1%2C0.5-0.1c0%2C0.1%2C0%2C0.2%2C0%2C0.3c0%2C0.8%2C0.8%2C1.2%2C1.5%2C1.3c2.3%2C0.4%2C4.6%2C1.1%2C7%2C0.7%0A%09%09c2.5-1.1%2C5-2.4%2C6.3%2C1.5c0.9%2C0.1%2C2%2C0.6%2C2.6%2C0.2c5.4-2.9%2C10.6-2%2C15.4%2C2.9c0.8%2C0.8%2C2.2%2C1.6%2C1.3%2C2.9c-0.7%2C1-1.2%2C0.8-1.7%2C0.4%0A%09%09c0.2-1-0.9-1.6-1.6-2.3c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5c-2.4%2C0.4-4.7-0.3-7-0.7%0A%09%09c-0.8-0.1-1.5-0.5-1.5-1.3C-52.2-13.7-51.3-13.6-50.6-13.9z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-31.7-21c-0.3%2C1.4%2C0.5%2C1.7%2C1.5%2C1.2c4.8-2.8%2C8%2C0.8%2C11.2%2C3.1c0.9%2C0.6%2C1.6%2C1.4%2C2.5%2C1.8%0A%09%09%09c-0.2%2C0.3-0.4%2C0.6-0.4%2C1.2c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.4-1.8%2C2-3.1%2C3.8-3.6%0A%09%09%09C-30.8-22.9-31.5-22-31.7-21z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-18.3-28.9c1.3%2C1.3%2C0.2%2C1.5-0.8%2C1.8c-0.5%2C2-1.2%2C3.6-3%2C3.5c0.4-0.6%2C0.7-1.5%2C1-2.5c1-0.3%2C2.1-0.6%2C0.8-1.8%0A%09%09%09c0.3-1.7%2C0.8-3%2C2.4-2.5C-18.1-30-18.3-29.5-18.3-28.9z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-44.5-41.5c-2.3%2C1%2C1.2%2C2%2C1.9%2C3.1c0.7%2C1.2%2C0.2%2C2.3%2C0.1%2C3.4c-0.3%2C2.1%2C0.7%2C4.1%2C2.8%2C3.3c2.5-1%2C5-1.2%2C7.8-1.3%0A%09%09c0.2%2C0.3%2C0.4%2C0.7%2C0.7%2C1c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4c-0.7-1.1-4.1-2.1-1.9-3.1%0A%09%09c1.8-0.8%2C3.6-2.5%2C5.6-3.2C-42.2-42.9-43.3-42-44.5-41.5z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-25.1%2C27.3c0.3%2C0.4%2C0.9%2C0.6%2C1.5%2C0.6c-0.8%2C1.4-2.7%2C1.2-3.5%2C0.4c-2.3-2.4-7.8-1.8-7-7.2c0.7%2C0%2C1.4-0.1%2C1.9-0.4%0A%09%09%09C-32.4%2C25.4-27.2%2C24.9-25.1%2C27.3z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-28.6%2C18.1c-0.5%2C1.3-1.4%2C1.7-2.5%2C1.9c0.2-0.2%2C0.4-0.5%2C0.5-0.9c0.1-1.1%2C0.3-2.2%2C1.6-2.4c0.3%2C0%2C0.5%2C0%2C0.7%2C0.1%0A%09%09%09C-28.5%2C17.2-28.5%2C17.7-28.6%2C18.1z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-35.3c0%2C0.3%2C0%2C0.5%2C0%2C0.8c-5.3%2C0.5-10.5%2C0.9-15-2.5c0.8-0.3%2C1.5-0.6%2C2.3-0.8%0A%09%09C-23.2-35.1-18.9-35-14.4-35.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.2%2C40.4c0.4%2C0.8%2C1.3%2C1%2C2.1%2C1.1c-0.6%2C0.2-1.2%2C0.5-1.8%2C1c-0.9-0.1-1.8-0.3-2.3-1.1c-1.4-2.3-2.5-5-5.1-4.3%0A%09%09C36.3%2C34.2%2C37.5%2C37.6%2C39.2%2C40.4z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M46.9%2C40.9c1.8%2C0.9%2C0%2C2.6%2C0.2%2C4c-0.7%2C0.4-1.3%2C0.7-2%2C1c-0.2-1.4%2C1.6-3.1-0.2-4c-1-0.5-2.1-0.7-3.2-0.4%0A%09%09C43.3%2C40.1%2C45.2%2C40%2C46.9%2C40.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M29.2%2C35.5c0.2%2C1%2C1%2C1.9%2C1.7%2C2c-0.4%2C0.2-0.8%2C0.5-1.2%2C0.8c-1%2C0.7-2.3-0.5-2.5-1.8c-0.3-1.6%2C1-1.5%2C2-1.6%0A%09%09C29.2%2C35.1%2C29.2%2C35.3%2C29.2%2C35.5z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_28%22%20viewBox%3D%22-4.7%20-2.5%209.4%205%22%3E%0A%0A%09%09%3Cellipse%20transform%3D%22matrix%280.3883%20-0.9215%200.9215%200.3883%201.676236e-12%20-1.112622e-12%29%22%20class%3D%22st2%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%221.7%22%20ry%3D%225.1%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_81%22%20viewBox%3D%22-8%20-9.6%2016%2014.9%22%3E%0A%09%3Cpath%20class%3D%22st3%22%20d%3D%22M-2.6-9.6c-2.1%2C0.1-4%2C1.7-4.9%2C3.8c-0.8%2C1.9-0.7%2C4.6%2C1.7%2C6.4c3.1%2C2.3%2C7%2C3.3%2C9.8%2C3.6c0.1%2C0.1%2C0.3%2C0.3%2C0.4%2C0.4%0A%09%09C4.8%2C4.9%2C5.3%2C5.1%2C5.7%2C5c0.6%2C0%2C1.1-0.3%2C1.6-0.8c0.1%2C0%2C0.1-0.1%2C0.1-0.2C7.5%2C4%2C7.5%2C4%2C7.6%2C3.9C7.9%2C3.4%2C8%2C2.9%2C8%2C2.4C8%2C2%2C7.8%2C1.3%2C7.2%2C0.8%0A%09%09C7.1%2C0.8%2C6.9%2C0.7%2C6.8%2C0.6c-1-2.9-2.9-6.8-6.1-9.1C-0.3-9.3-1.5-9.7-2.6-9.6C-2.6-9.6-2.6-9.6-2.6-9.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st4%22%20d%3D%22M6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6c-0.5%2C0.6-1.3%2C0.9-2%2C0.3C4.6%2C4.8%2C4.4%2C4.6%2C4.3%2C4.5%0A%09%09C1.7%2C4.1-2.4%2C3.2-5.5%2C0.9c-4.9-3.7%2C0.7-11.5%2C5.6-7.7c3.2%2C2.4%2C5%2C6.5%2C5.9%2C9c0.2%2C0.1%2C0.3%2C0.2%2C0.5%2C0.3C7.3%2C3.1%2C7.2%2C4%2C6.8%2C4.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st5%22%20d%3D%22M4.6%2C3.4c0%2C0-1.5-4.2-5.3-6.8s-6.7%2C1.9-3%2C4.4S4.6%2C3.4%2C4.6%2C3.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_82%22%20viewBox%3D%22-6.4%20-7.4%2012.7%2014.7%22%3E%0A%09%3Cpath%20class%3D%22st6%22%20d%3D%22M-1.7%2C6.4c2.2-2%2C5.9%2C3.5%2C6.3-0.7c0.3-2.6%2C3.7-6%2C0.3-8.5c-2.8-2-6-4.4-9.2-4.6c-3-0.2-2.1%2C3.1-0.8%2C4.8%0A%09%09c1.6%2C2.1%2C6.7%2C3.6%2C0.5%2C6.4C-4.9%2C4-5%2C5.6-4.6%2C6.3C-3.7%2C8.2-2.6%2C7-1.7%2C6.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_83%22%20viewBox%3D%22-21.4%20-11%2042.8%2021.9%22%3E%0A%09%3Cellipse%20class%3D%22st7%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2221.4%22%20ry%3D%2211%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22middle%22%20viewBox%3D%22-9.3%20-9.3%2018.7%2018.7%22%3E%0A%09%3Ccircle%20class%3D%22st8%22%20cx%3D%220%22%20cy%3D%220%22%20r%3D%229.3%22%2F%3E%0A%09%3Ccircle%20class%3D%22st9%22%20cx%3D%22-2.7%22%20cy%3D%222.2%22%20r%3D%224.8%22%2F%3E%0A%09%3Ccircle%20class%3D%22st10%22%20cx%3D%22-3.7%22%20cy%3D%223.2%22%20r%3D%222.5%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone3%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_1_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.205665e-02%22%20style%3D%22stop-color%3A%23F7F4F1%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%23CDBCB3%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st11%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_2_%22%20cx%3D%22-7.4167%22%20cy%3D%2211.5833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.9817%20-0.1905%200.11%200.5668%20-1.4098%203.6055%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.2125%22%20style%3D%22stop-color%3A%23FFFFFF%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8374%22%20style%3D%22stop-color%3A%23FFFFFF%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st12%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_3_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1019%22%20style%3D%22stop-color%3A%23C19377%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%23C19377%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st13%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone4%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_4_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%222.963362e-02%22%20style%3D%22stop-color%3A%2398A6B2%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.2213%22%20style%3D%22stop-color%3A%238B9BA9%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7139%22%20style%3D%22stop-color%3A%236F8295%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%2365798D%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st14%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_5_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1609%22%20style%3D%22stop-color%3A%23254058%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4016%22%20style%3D%22stop-color%3A%23354E65%3Bstop-opacity%3A0.8176%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4664%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0.7686%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st15%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_6_%22%20cx%3D%22-10.9167%22%20cy%3D%2214.0833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.997%207.794188e-02%20-4.499866e-02%200.5756%200.6005%206.8281%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1287%22%20style%3D%22stop-color%3A%23DAE4EA%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.3452%22%20style%3D%22stop-color%3A%23D1DBE1%3Bstop-opacity%3A0.6859%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8178%22%20style%3D%22stop-color%3A%23C1CCD2%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st16%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22%D1%8B%D0%B5%D1%89%D1%82%D1%831%22%20viewBox%3D%22-38%20-28.5%2076%2057%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_7_%22%20cx%3D%22-9.75%22%20cy%3D%2213.4167%22%20r%3D%2256.4377%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%202.2799%2010.1643%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%225.041564e-03%22%20style%3D%22stop-color%3A%23ABDF93%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.1414%22%20style%3D%22stop-color%3A%239BCC84%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4983%22%20style%3D%22stop-color%3A%2374A060%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.679%22%20style%3D%22stop-color%3A%23658F52%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st17%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_8_%22%20cx%3D%225.75%22%20cy%3D%22-6.5833%22%20r%3D%2232.95%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%20-1.0393%20-5.3709%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.321%22%20style%3D%22stop-color%3A%234D8035%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.995%22%20style%3D%22stop-color%3A%234D8035%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st18%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_9_%22%20cx%3D%22-9%22%20cy%3D%2213.75%22%20r%3D%2222.0482%22%20gradientTransform%3D%22matrix%280.9129%200.4081%20-0.1887%200.4221%201.8107%2011.6196%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.891172e-02%22%20style%3D%22stop-color%3A%23D7FFC5%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7851%22%20style%3D%22stop-color%3A%23D7FFC5%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st19%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_10_%22%20cx%3D%2234%22%20cy%3D%22-16.3333%22%20r%3D%2261.6988%22%20gradientTransform%3D%22matrix%280.9725%200.2331%20-0.1028%200.4289%20-0.7427%20-17.2516%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220%22%20style%3D%22stop-color%3A%23C1FDAC%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.6442%22%20style%3D%22stop-color%3A%238DB970%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st20%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_2%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_10%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_11%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_12%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_3%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_1%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st27%22%20d%3D%22M3%2C57.8C4.7%2C59.2%2C6.8%2C60%2C8.9%2C60c1.9%2C0%2C3.7-0.6%2C5.3-1.7l1.6-1.4C28.5%2C45.1%2C45.6%2C37%2C64.3%2C33.6%0A%09%09%09c3.8%2C7.1%2C11.4%2C12%2C20%2C12c8.6%2C0%2C16.1-4.8%2C20-11.9c13.8%2C2.6%2C26.8%2C7.7%2C37.8%2C15.1c-3.3%2C1.3-5.6%2C4.5-5.6%2C8.3c0%2C4.9%2C4%2C8.9%2C8.9%2C8.9l19.9%2C0%0A%09%09%09c0.5%2C0%2C1-0.1%2C1.5-0.2c0.2%2C0%2C0.3-0.1%2C0.4-0.1c0.4-0.1%2C0.9-0.2%2C1.3-0.4c0.1%2C0%2C0.2-0.1%2C0.2-0.1c0.5-0.2%2C0.9-0.4%2C1.3-0.7l0.1-0.1%0A%09%09%09c0.3-0.2%2C0.5-0.4%2C0.8-0.6c0.2-0.2%2C0.4-0.3%2C0.5-0.5c1.7-1.8%2C2.7-4.2%2C2.5-6.7l0-19.2c0-4.9-4-8.9-8.9-8.9c-4.7%2C0-8.6%2C3.7-8.9%2C8.4%0A%09%09%09C142%2C26.4%2C124.4%2C19%2C106%2C15.8C103%2C6.6%2C94.4%2C0%2C84.3%2C0C74.3%2C0%2C65.7%2C6.6%2C62.7%2C15.7C39.9%2C19.6%2C18.9%2C29.5%2C3.2%2C44.1l-0.4%2C0.4%0A%09%09%09c-0.2%2C0.2-0.4%2C0.4-0.6%2C0.6C-1%2C48.9-0.7%2C54.5%2C3%2C57.8z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M4%2C56.6c1.4%2C1.2%2C3.1%2C1.8%2C4.9%2C1.8c1.6%2C0%2C3.1-0.5%2C4.4-1.4l0.6-0.5c0.1-0.1%2C0.3-0.3%2C0.4-0.4l0.4-0.4%0A%09%09%09C28%2C43.6%2C45.7%2C35.2%2C65%2C31.9c3.4%2C7.2%2C10.8%2C12.3%2C19.3%2C12.3c8.5%2C0%2C15.8-5%2C19.2-12.2c15.7%2C2.8%2C30.4%2C8.9%2C42.3%2C17.6h-0.5%0A%09%09%09c-4.1%2C0-7.4%2C3.3-7.4%2C7.4c0%2C4.1%2C3.3%2C7.4%2C7.4%2C7.4l19.9%2C0c0.4%2C0%2C0.8-0.1%2C1.2-0.1c0.1%2C0%2C0.2-0.1%2C0.3-0.1c0.4-0.1%2C0.7-0.2%2C1.1-0.3%0A%09%09%09c0.1%2C0%2C0.1-0.1%2C0.2-0.1c0.4-0.2%2C0.7-0.4%2C1.1-0.6l0.1-0.1c0.2-0.1%2C0.4-0.3%2C0.6-0.5c0.2-0.1%2C0.3-0.3%2C0.4-0.4%0A%09%09%09c1.5-1.5%2C2.3-3.6%2C2.1-5.7l0-19.2c0-4.1-3.3-7.4-7.4-7.4s-7.4%2C3.3-7.4%2C7.4v2.5c-14.6-11.5-33-19.4-52.7-22.7%0A%09%09%09C102.4%2C8.1%2C94.2%2C1.4%2C84.3%2C1.4C74.5%2C1.4%2C66.3%2C8%2C63.8%2C17C40.9%2C20.8%2C20%2C30.6%2C4.3%2C45.1l-0.4%2C0.4c-0.2%2C0.2-0.4%2C0.4-0.5%2C0.6%0A%09%09%09C0.6%2C49.2%2C0.9%2C53.9%2C4%2C56.6z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st28%22%20d%3D%22M5.3%2C55.1c1%2C0.9%2C2.3%2C1.3%2C3.6%2C1.3c1.2%2C0%2C2.3-0.4%2C3.2-1.1c0.4-0.4%2C0.7-0.7%2C1.1-1.1c0%2C0%2C0.1-0.1%2C0.1-0.1l0%2C0%0A%09%09%09c13.7-12.6%2C32.4-21.3%2C52.7-24.5c2.8%2C7.4%2C9.9%2C12.6%2C18.2%2C12.6c8.3%2C0%2C15.4-5.2%2C18.2-12.5c18.6%2C3.1%2C35.9%2C10.7%2C49.2%2C21.8h-6.4%0A%09%09%09c-3%2C0-5.4%2C2.4-5.4%2C5.4c0%2C3%2C2.4%2C5.4%2C5.4%2C5.4l19.8%2C0c0.3%2C0%2C0.6%2C0%2C0.9-0.1c0.1%2C0%2C0.2%2C0%2C0.2-0.1c0.3-0.1%2C0.6-0.1%2C0.8-0.3%0A%09%09%09c0.1%2C0%2C0.1%2C0%2C0.1-0.1c0.3-0.1%2C0.5-0.3%2C0.8-0.4l0.1-0.1c0.1-0.1%2C0.3-0.2%2C0.5-0.3c0.1-0.1%2C0.1-0.1%2C0.2-0.2l0.1-0.1%0A%09%09%09c1.1-1.1%2C1.7-2.6%2C1.5-4.2l0-19.3c0-3-2.4-5.4-5.4-5.4c-3%2C0-5.4%2C2.4-5.4%2C5.4v6.7c-15.1-13-34.9-21.8-56.2-25.1%0A%09%09%09C101.7%2C10%2C93.8%2C3.3%2C84.3%2C3.3c-9.4%2C0-17.3%2C6.7-19.1%2C15.6c-23%2C3.5-44.1%2C13.4-59.6%2C27.7c-0.3%2C0.3-0.5%2C0.6-0.8%2C0.9%0A%09%09%09C2.9%2C49.7%2C3.1%2C53.2%2C5.3%2C55.1z%22%2F%3E%0A%09%09%3Cg%3E%0A%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M98.4%2C19.8L98.4%2C19.8c-1.6-1.5-4.7-4.2-6.7-5.9c-0.9-0.7-1.9-1.2-2.9-1.5c-0.8-0.2-1.7-0.2-2.6%2C0%0A%09%09%09%09c-0.7%2C0.1-1.3%2C0.4-1.8%2C0.6c-0.5-0.2-1.1-0.4-1.8-0.6c-0.9-0.2-1.8-0.2-2.6%2C0c-1.1%2C0.2-2.1%2C0.7-2.9%2C1.5c-2%2C1.7-5%2C4.4-6.7%2C5.9%0A%09%09%09%09c-1.2%2C1.1-1.5%2C2.9-0.7%2C4.3c1.3%2C2.3%2C2.7%2C4.1%2C4.3%2C5.5c1.2%2C1.1%2C2.5%2C2%2C3.9%2C2.6c1.7%2C0.7%2C3.4%2C1.1%2C5.3%2C1.1h2.6c1.8%2C0%2C3.6-0.4%2C5.3-1.1%0A%09%09%09%09c1.4-0.6%2C2.7-1.5%2C3.9-2.6c1.6-1.4%2C3-3.3%2C4.3-5.5C99.9%2C22.6%2C99.6%2C20.9%2C98.4%2C19.8z%22%2F%3E%0A%09%09%09%3Cpath%20class%3D%22st29%22%20d%3D%22M97.1%2C21.2c-1.5-1.4-4.6-4.2-6.6-5.9C87.7%2C13%2C84.6%2C15%2C84.6%2C15s-0.2%2C0.1-0.3%2C0.1C84.2%2C15.1%2C84%2C15%2C84%2C15%0A%09%09%09%09s-3.1-2-5.8%2C0.3c-2%2C1.7-5.1%2C4.5-6.6%2C5.9c-0.5%2C0.5-0.7%2C1.3-0.3%2C1.9c1.4%2C2.5%2C5%2C8.3%2C11.7%2C8.3c0.3%2C0%2C2.3%2C0%2C2.6%2C0%0A%09%09%09%09c6.7%2C0%2C10.4-5.8%2C11.7-8.3C97.7%2C22.5%2C97.6%2C21.7%2C97.1%2C21.2z%22%2F%3E%0A%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M91.6%2C22.2c-0.1-0.7-6.6-0.6-7.3-0.6c-0.7%2C0-7.2-0.1-7.3%2C0.6c-0.1%2C0.7%2C2.8%2C2.7%2C7.3%2C2.7%0A%09%09%09%09C88.9%2C24.9%2C91.7%2C22.9%2C91.6%2C22.2z%22%2F%3E%0A%09%09%3C%2Fg%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_8%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_9%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_4%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_5%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_6%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_7%22%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
	"ui_arrow_refuse_down.svg": "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2022.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%20%20%20%20%20width%3D%22174%22%20height%3D%2266%22%0A%09%20viewBox%3D%220%200%20174%2066%22%20style%3D%22enable-background%3Anew%200%200%20174%2066%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%09.st0%7Bopacity%3A0.9%3B%7D%0A%09.st1%7Bfill%3A%23FF833F%3B%7D%0A%09.st2%7Bfill%3A%23EBF2DC%3B%7D%0A%09.st3%7Bopacity%3A0.4%3Bfill%3A%23D45F26%3B%7D%0A%09.st4%7Bfill%3A%23FFC449%3B%7D%0A%09.st5%7Bfill%3A%23FCD578%3B%7D%0A%09.st6%7Bfill%3A%23C26934%3B%7D%0A%09.st7%7Bfill%3A%23F9AA18%3B%7D%0A%09.st8%7Bfill%3A%23D61A3D%3B%7D%0A%09.st9%7Bfill%3A%23EE3457%3B%7D%0A%09.st10%7Bfill%3A%23FF8097%3B%7D%0A%09.st11%7Bfill%3Aurl%28%23SVGID_1_%29%3B%7D%0A%09.st12%7Bfill%3Aurl%28%23SVGID_2_%29%3B%7D%0A%09.st13%7Bfill%3Aurl%28%23SVGID_3_%29%3B%7D%0A%09.st14%7Bfill%3Aurl%28%23SVGID_4_%29%3B%7D%0A%09.st15%7Bfill%3Aurl%28%23SVGID_5_%29%3B%7D%0A%09.st16%7Bfill%3Aurl%28%23SVGID_6_%29%3B%7D%0A%09.st17%7Bfill%3Aurl%28%23SVGID_7_%29%3B%7D%0A%09.st18%7Bfill%3Aurl%28%23SVGID_8_%29%3B%7D%0A%09.st19%7Bfill%3Aurl%28%23SVGID_9_%29%3B%7D%0A%09.st20%7Bfill%3Aurl%28%23SVGID_10_%29%3B%7D%0A%09.st21%7Bfill%3A%23FFFFFF%3B%7D%0A%09.st22%7Bfill%3A%23FF6100%3B%7D%0A%09.st23%7Bopacity%3A0.8%3Bfill%3Aurl%28%23SVGID_11_%29%3B%7D%0A%09.st24%7Bfill%3Aurl%28%23SVGID_12_%29%3B%7D%0A%09.st25%7Bfill%3A%23E0B993%3B%7D%0A%09.st26%7Bfill%3Anone%3Bstroke%3A%23FFFFFF%3Bstroke-width%3A2%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A10%3B%7D%0A%09.st27%7Bopacity%3A0.15%3Bfill%3A%23020202%3B%7D%0A%09.st28%7Bfill%3A%239BCC33%3B%7D%0A%09.st29%7Bfill%3A%23E03D1F%3B%7D%0A%3C%2Fstyle%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_26%22%20viewBox%3D%22-55%20-45.9%20110.1%2091.8%22%3E%0A%09%3Cg%20class%3D%22st0%22%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M42.8-18.5c-0.1%2C2.1%2C0.7%2C3.6%2C2.2%2C5.1c1.7%2C1.6%2C4.1%2C3.6%2C4.2%2C5.5c0.3%2C7.6%2C5.2%2C13.7%2C5.8%2C21.1%0A%09%09%09C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5c-0.4-2.4%2C2-2.1%2C3.5-2.3c1.8-0.2%2C2.3-1.3%2C1.9-2.8%0A%09%09%09c-0.5-2-1.8-1.5-3.1-0.9c-1.5%2C0.7-2.9%2C1.5-4.4%2C2.1c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1c-2-3.1-5.2-2-8-2.3%0A%09%09%09c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c3.7-2.8%2C7.8-2.4%2C11.9-1.4c4%2C0.9%2C8%2C2.1%2C11.8-0.5C42.2-18.5%2C42.5-18.5%2C42.8-18.5z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M49.2%2C20.6c1.8%2C0.4%2C2.1%2C1.7%2C0.6%2C2.2c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2%0A%09%09%09c-0.1-1.3-0.7-2.7-1.8-2.8c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.1-2.9%2C4.3-3.3%2C7.8-3.3c2.5%2C1.8%2C5.1%2C0.6%2C7.1-0.5%0A%09%09%09C18.7-6%2C22.5-6%2C26.4-5.2c1.9%2C5%2C1.4%2C5.6-3.9%2C5c-1.6-0.2-3.2-0.1-4.9-0.3c-1.2-0.1-2.6-0.7-2.9%2C0.9c-0.3%2C1.4%2C1.5%2C1%2C2.2%2C1.6%0A%09%09%09c4.4%2C4.1%2C11.8%2C1.7%2C15.6%2C7.5c1.2%2C1.8%2C3.1%2C3%2C2.5%2C5.6c-0.4%2C1.8%2C0.9%2C2.3%2C2.3%2C2.4C40.4%2C22.3%2C45.1%2C20.2%2C49.2%2C20.6z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-15.1-30c0.6-0.3%2C1.2-0.7%2C1.7-1c2.8-0.4%2C2.5-2.6%2C2.5-4.6c1.7-0.2%2C3.1-0.4%2C1.4-2.6c-1.9-2.5-4.1-4.2-7.3-4.3%0A%09%09%09c-1.4-0.1-3.1-0.8-2.9-2.2c0.2-2%2C2-0.9%2C3.2-0.8C-11-45.2-5.8-43-0.3-43.1c0.9%2C0%2C1.9%2C0.3%2C2%2C1.4c0.1%2C1-0.8%2C1-1.5%2C1.2%0A%09%09%09C-4.4-39.7-2.6-38-0.6-36c1.7%2C1.6%2C3.5%2C2.8%2C5.9%2C2.3c0%2C1.5%2C0.2%2C3%2C1.1%2C4.4c-4%2C3.9-5%2C3.7-7.6-0.8c-1.1-1.9-3-2.9-4.9-1.8%0A%09%09%09c-2.2%2C1.3%2C0.2%2C2.7%2C0.4%2C4c0.3%2C2.3%2C2.9%2C2.5%2C3.4%2C4.4c-1.6%2C0-3.1%2C0.2-4.4%2C1.1C-9-25.4-13.2-26.4-15.1-30z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M13.3-24.2c0.3-1.5%2C1.1-2.7%2C2.6-2.4c1.8%2C0.4%2C4.5-0.3%2C4.9%2C2.6c0.3%2C2.2-1.5%2C2.1-3%2C2.2%0A%09%09%09C15.9-21.6%2C14.1-22%2C13.3-24.2z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M12.8-10.8c-1.1%2C3.2-3.8%2C1.9-5.9%2C1.8C5.4-9%2C6.2-10.5%2C6.5-11.4C8.6-11.2%2C10.8-12.3%2C12.8-10.8z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M6.6%2C11c2.3-0.3%2C5-1.9%2C5.8%2C2.2c0.3%2C1.4%2C2%2C0.9%2C3.1%2C1.3c1.6%2C0.6%2C4.1%2C0.6%2C4.2%2C2.7c0.1%2C2.3-2.9%2C0.6-4.6%2C3.1%0A%09%09%09c4.7-1.8%2C7.3%2C3.7%2C11.9%2C1.1c2.1-1.2%2C3.8%2C1.2%2C4.1%2C2.9c0.5%2C2.4%2C1.7%2C5.2-1.6%2C7.1c-5.3%2C3-8.7%2C4.7-15.8-1.9c-1.6-2.1-4.3-3.3-4.5-6.6%0A%09%09%09c-0.1-1.2-1.9-1.1-3.1-1.1c-0.2-1.7%2C2.3-4.4-1.3-4.7c-1.6-0.1-3.6%2C1.2-5%2C2.3c-1.4%2C1.1-0.8%2C2.3%2C1%2C2.7c-2.7%2C3.3-5.7%2C0.1-6.9-0.9%0A%09%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c2.7%2C0.8%2C4.4-1.7%2C6.7-1.6l0%2C0c4.7%2C5.3%2C6.1%2C5.2%2C8.9-0.5C2.4%2C10.6%2C4.5%2C10.8%2C6.6%2C11z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-9.5-9.7c3%2C0.8%2C3.7%2C2.3%2C1.1%2C4.4c-1.3%2C1-1.9%2C2.1-1.6%2C3.7c-4.4%2C1.1-6%2C3.6-3.5%2C6.3c4%2C4.4-1%2C4.2-2.4%2C4.9%0A%09%09%09c-1.6%2C0.8-4.4-1.2-5.2%2C2.2c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3%0A%09%09%09c-1.2-0.8-2.5-1.5-3.3-2.8c0.1-1.7%2C1.3-1.9%2C2.6-1.9c0.8%2C3.4%2C4.3%2C3.2%2C6.5%2C4.6c1.3%2C0.9%2C1.5-1.1%2C1.5-2.3c1.3-0.1%2C2.7-0.4%2C3.8%2C0.6%0A%09%09%09c0.8%2C0.7%2C1.7%2C2.3%2C2.8%2C0.6c0.9-1.3-0.5-2.1-1.3-2.9c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5%0A%09%09%09c-2.4%2C0.4-4.7-0.3-7-0.7c-0.8-0.1-1.5-0.5-1.5-1.3c0-1%2C0.9-0.9%2C1.6-1.2c1.6-0.7%2C4.9%2C2.5%2C4.6-1.5c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09%09c-0.8-1-2.7-0.8-2.8-2.6c2.1-1.8%2C7.5-1.3%2C9.4%2C1.3c2%2C2.7%2C4.2%2C3.7%2C7.5%2C3.4c2.6-0.3%2C4.9%2C1.8%2C7.1%2C2.9c3.4%2C1.7%2C7.5%2C1.6%2C10.5%2C4.3%0A%09%09%09c1.3%2C1.2%2C3.1%2C0.6%2C4.7%2C0.6C-13.7-6.9-12.1-6.8-9.5-9.7z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-16.5c-0.7%2C1-2.6%2C0.9-2.5%2C2.7c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1%0A%09%09%09c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.7-3%2C4.9-4.9%2C7.7-3.3c3.2%2C1.8%2C4.2-0.2%2C4.9-2.8c1-0.3%2C2.1-0.6%2C0.8-1.8c0.4-2.1%2C1.1-3.5%2C3.5-2%0A%09%09%09C-18.5-25-17.3-20.6-14.4-16.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-36.9-37.9c4.2-0.5%2C3.5%2C3.5%2C5.7%2C5.9c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4%0A%09%09%09c-0.7-1.1-4.1-2.1-1.9-3.1c3-1.4%2C6-5.3%2C10.1-2.6c1.3%2C0.8%2C0.2%2C1.4-0.7%2C1.7c-1%2C0.2-2.6-0.3-2.8%2C0.8C-40.1-38.9-38-38.7-36.9-37.9z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-30.6%2C19.1c0.1-1.1%2C0.3-2.2%2C1.6-2.4c1.3-0.2%2C1.7%2C0.9%2C2.2%2C1.8c0.6%2C1%2C0.6%2C2-0.5%2C2.7c-4.1%2C2.8-0.4%2C3.2%2C1.3%2C3.8%0A%09%09%09c1.4%2C0.5%2C3.3%2C0.2%2C2.6%2C2.4c-0.6%2C1.8-2.9%2C1.7-3.7%2C0.8c-2.3-2.4-7.8-1.8-7-7.2C-32.5%2C21.1-31.2%2C20.7-30.6%2C19.1z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-34.5c-5.3%2C0.5-10.5%2C0.9-15-2.5c4.1-1.7%2C8.5-1.6%2C12.9-1.8c0.2%2C1.1%2C0.8%2C1.6%2C1.9%2C1.7l0%2C0%0A%09%09%09C-14.5-36.3-14.4-35.4-14.4-34.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.5%2C42.6c-0.9-0.1-1.8-0.3-2.3-1.1c-1.7-2.9-3-6.4-7.5-3.1c-1%2C0.7-2.3-0.5-2.5-1.8%0A%09%09%09c-0.3-1.6%2C1.2-1.4%2C2.1-1.6c6.1-0.8%2C12-3.3%2C18.3-0.9c0.6%2C0.2%2C1.6%2C0%2C1.7%2C1c0.1%2C1.1-0.9%2C1.4-1.7%2C1.6c-0.4%2C0.1-0.9%2C0.1-1.3%2C0.2%0A%09%09%09c-1.3%2C0.3-3.7-0.5-3.7%2C1.4c0%2C2.2%2C2.6%2C1.8%2C4.2%2C2.2c1.9%2C0.4%2C4.9-1.3%2C5.5%2C1.3c0.5%2C2.4-2.9%2C1.8-4.4%2C2.8c-0.8%2C0.6-1.8%2C1-2.7%2C1.4%0A%09%09%09c-0.2-1.4%2C1.6-3.1-0.2-4C43.2%2C41%2C41.1%2C41.1%2C39.5%2C42.6z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39-3.9c-0.1%2C0.3-0.2%2C0.7-0.1%2C1.2c0.4%2C2.4%2C2.3%2C5%2C4.7%2C4.5c4.8-1%2C3.9%2C2.1%2C4.2%2C4.6c2.5%2C1.3%2C4.5%2C3.4%2C6.9%2C4.8%0A%09%09c0.1%2C0.7%2C0.2%2C1.4%2C0.3%2C2.1C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5C36.6-3.5%2C37.8-3.8%2C39-3.9z%22%0A%09%09%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M20.1-17.6c-0.7%2C0.5-1.7%2C0.9-1.4%2C2c0.4%2C1.1%2C1.5%2C0.7%2C2.3%2C0.8c2.8%2C0.3%2C6-0.8%2C8%2C2.3c1.8%2C0.2%2C2.6%2C1.6%2C2.7%2C3.1%0A%09%09c0.2%2C4%2C2.4%2C3.8%2C5.1%2C2.7c0.6-0.2%2C1.1-0.5%2C1.6-0.7c-1.2%2C0.6-2.4%2C1.2-3.6%2C1.7c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1%0A%09%09c-2-3.1-5.2-2-8-2.3c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c0.9-0.7%2C1.8-1.1%2C2.7-1.5C20.6-17.9%2C20.3-17.7%2C20.1-17.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M7%2C0.3c2.2%2C5%2C6.7%2C6.2%2C10.4%2C8.2c5.4%2C2.9%2C9.2%2C8.5%2C15.8%2C9.1c1.1%2C0.1%2C1.8%2C1.5%2C1.8%2C2.8c0.1%2C3.4%2C2.9%2C4.5%2C5.3%2C4.2%0A%09%09c3.5-0.3%2C6.9-1.4%2C10.2-2.5c-0.2%2C0.2-0.4%2C0.4-0.9%2C0.6c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2c-0.1-1.3-0.7-2.7-1.8-2.8%0A%09%09c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.4-2.2%2C4-3%2C6.2-3.3C6-2.6%2C6.2-1.5%2C7%2C0.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-17.7-45.7c-0.2%2C1.4%2C1.5%2C2.1%2C2.9%2C2.2c3.2%2C0.2%2C5.4%2C1.9%2C7.3%2C4.3c1.6%2C2.1%2C0.4%2C2.4-1.2%2C2.6c0-0.4-0.2-0.9-0.8-1.6%0A%09%09c-1.9-2.5-4.1-4.2-7.3-4.3c-1.4-0.1-3.1-0.8-2.9-2.2C-19.5-46.1-18.6-46-17.7-45.7C-17.7-45.7-17.7-45.7-17.7-45.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-13-31c0%2C0-0.1%2C0-0.1%2C0.1c1.9%2C3.6%2C6.1%2C4.6%2C8.5%2C7.6c0.7-0.4%2C1.3-0.7%2C2.1-0.9c0.1%2C0.2%2C0.3%2C0.5%2C0.3%2C0.7%0A%09%09c-1.6%2C0-3.1%2C0.2-4.4%2C1.1c-2.4-3-6.6-4.1-8.5-7.6c0.6-0.3%2C1.2-0.7%2C1.7-1C-13.2-31-13.1-31-13-31z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M15.3-25.2c0.8%2C2.2%2C2.6%2C2.6%2C4.6%2C2.4c0.3%2C0%2C0.6%2C0%2C0.9-0.1c-0.4%2C1-1.7%2C1-2.9%2C1.1c-2%2C0.2-3.8-0.2-4.6-2.4%0A%09%09c0.3-1.4%2C1.1-2.7%2C2.5-2.4C15.6-26.2%2C15.4-25.7%2C15.3-25.2z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M8.9-9.9c1%2C0.1%2C2.2%2C0.4%2C3.3%2C0.3c-1.3%2C1.7-3.5%2C0.8-5.3%2C0.7C5.4-9%2C6.2-10.5%2C6.5-11.4c0.6%2C0.1%2C1.1%2C0%2C1.7%2C0%0A%09%09C7.9-10.7%2C7.9-10%2C8.9-9.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M4.9%2C17.1c-0.5%2C0-1%2C0.1-1.5%2C0.2c1.1-0.7%2C2.4-1.3%2C3.5-1.2c3.6%2C0.3%2C1.2%2C3%2C1.3%2C4.7c1.2%2C0%2C3-0.1%2C3.1%2C1.1%0A%09%09c0.2%2C3.2%2C2.8%2C4.5%2C4.5%2C6.6c5.5%2C5.2%2C8.8%2C5.3%2C12.5%2C3.7c-4.6%2C2.5-8%2C3.4-14.5-2.7c-1.6-2.1-4.3-3.3-4.5-6.6c-0.1-1.2-1.9-1.1-3.1-1.1%0A%09%09C6.1%2C20.1%2C8.5%2C17.3%2C4.9%2C17.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4%2C13.8c2.7%2C3.3%2C7.3%2C3.5%2C10.5%2C6.3c0.8%2C0.7%2C2.6%2C2.5%2C4.5%2C2.4C-2.1%2C25-4.9%2C22.1-6%2C21.1%0A%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c0.3%2C0.1%2C0.6%2C0.1%2C0.9%2C0.1C-14.4%2C13-14.4%2C13.5-14.4%2C13.8z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-33.1-6.7c-0.1%2C0.2-0.2%2C0.5-0.2%2C0.9c0.8%2C1.3%2C2%2C2%2C3.3%2C2.8c1.4%2C0.9%2C1.5%2C1.8-0.3%2C2.3c0.1%2C4.3%2C3.9%2C4.5%2C6.6%2C6%0A%09%09c2.1%2C0.3%2C1.9%2C2%2C1.8%2C3.4c-0.1%2C1.2%2C0.5%2C1.7%2C1.2%2C2c-0.2%2C0.3-0.3%2C0.6-0.4%2C1.1c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4%0A%09%09c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3c-1.2-0.8-2.5-1.5-3.3-2.8C-35.2-6.3-34.3-6.6-33.1-6.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.2-21.1c3.8-0.7%2C6%2C1.9%2C6.2%2C4.7c0.2%2C2.2-0.8%2C2.2-2%2C1.8c0-0.2%2C0-0.5%2C0-0.8c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09c-0.8-1-2.7-0.8-2.8-2.6c0.5-0.4%2C1.2-0.7%2C2-0.9C-52.8-21.9-51-22.1-50.2-21.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.6-13.9c0.1-0.1%2C0.3-0.1%2C0.5-0.1c0%2C0.1%2C0%2C0.2%2C0%2C0.3c0%2C0.8%2C0.8%2C1.2%2C1.5%2C1.3c2.3%2C0.4%2C4.6%2C1.1%2C7%2C0.7%0A%09%09c2.5-1.1%2C5-2.4%2C6.3%2C1.5c0.9%2C0.1%2C2%2C0.6%2C2.6%2C0.2c5.4-2.9%2C10.6-2%2C15.4%2C2.9c0.8%2C0.8%2C2.2%2C1.6%2C1.3%2C2.9c-0.7%2C1-1.2%2C0.8-1.7%2C0.4%0A%09%09c0.2-1-0.9-1.6-1.6-2.3c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5c-2.4%2C0.4-4.7-0.3-7-0.7%0A%09%09c-0.8-0.1-1.5-0.5-1.5-1.3C-52.2-13.7-51.3-13.6-50.6-13.9z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-31.7-21c-0.3%2C1.4%2C0.5%2C1.7%2C1.5%2C1.2c4.8-2.8%2C8%2C0.8%2C11.2%2C3.1c0.9%2C0.6%2C1.6%2C1.4%2C2.5%2C1.8%0A%09%09%09c-0.2%2C0.3-0.4%2C0.6-0.4%2C1.2c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.4-1.8%2C2-3.1%2C3.8-3.6%0A%09%09%09C-30.8-22.9-31.5-22-31.7-21z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-18.3-28.9c1.3%2C1.3%2C0.2%2C1.5-0.8%2C1.8c-0.5%2C2-1.2%2C3.6-3%2C3.5c0.4-0.6%2C0.7-1.5%2C1-2.5c1-0.3%2C2.1-0.6%2C0.8-1.8%0A%09%09%09c0.3-1.7%2C0.8-3%2C2.4-2.5C-18.1-30-18.3-29.5-18.3-28.9z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-44.5-41.5c-2.3%2C1%2C1.2%2C2%2C1.9%2C3.1c0.7%2C1.2%2C0.2%2C2.3%2C0.1%2C3.4c-0.3%2C2.1%2C0.7%2C4.1%2C2.8%2C3.3c2.5-1%2C5-1.2%2C7.8-1.3%0A%09%09c0.2%2C0.3%2C0.4%2C0.7%2C0.7%2C1c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4c-0.7-1.1-4.1-2.1-1.9-3.1%0A%09%09c1.8-0.8%2C3.6-2.5%2C5.6-3.2C-42.2-42.9-43.3-42-44.5-41.5z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-25.1%2C27.3c0.3%2C0.4%2C0.9%2C0.6%2C1.5%2C0.6c-0.8%2C1.4-2.7%2C1.2-3.5%2C0.4c-2.3-2.4-7.8-1.8-7-7.2c0.7%2C0%2C1.4-0.1%2C1.9-0.4%0A%09%09%09C-32.4%2C25.4-27.2%2C24.9-25.1%2C27.3z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-28.6%2C18.1c-0.5%2C1.3-1.4%2C1.7-2.5%2C1.9c0.2-0.2%2C0.4-0.5%2C0.5-0.9c0.1-1.1%2C0.3-2.2%2C1.6-2.4c0.3%2C0%2C0.5%2C0%2C0.7%2C0.1%0A%09%09%09C-28.5%2C17.2-28.5%2C17.7-28.6%2C18.1z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-35.3c0%2C0.3%2C0%2C0.5%2C0%2C0.8c-5.3%2C0.5-10.5%2C0.9-15-2.5c0.8-0.3%2C1.5-0.6%2C2.3-0.8%0A%09%09C-23.2-35.1-18.9-35-14.4-35.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.2%2C40.4c0.4%2C0.8%2C1.3%2C1%2C2.1%2C1.1c-0.6%2C0.2-1.2%2C0.5-1.8%2C1c-0.9-0.1-1.8-0.3-2.3-1.1c-1.4-2.3-2.5-5-5.1-4.3%0A%09%09C36.3%2C34.2%2C37.5%2C37.6%2C39.2%2C40.4z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M46.9%2C40.9c1.8%2C0.9%2C0%2C2.6%2C0.2%2C4c-0.7%2C0.4-1.3%2C0.7-2%2C1c-0.2-1.4%2C1.6-3.1-0.2-4c-1-0.5-2.1-0.7-3.2-0.4%0A%09%09C43.3%2C40.1%2C45.2%2C40%2C46.9%2C40.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M29.2%2C35.5c0.2%2C1%2C1%2C1.9%2C1.7%2C2c-0.4%2C0.2-0.8%2C0.5-1.2%2C0.8c-1%2C0.7-2.3-0.5-2.5-1.8c-0.3-1.6%2C1-1.5%2C2-1.6%0A%09%09C29.2%2C35.1%2C29.2%2C35.3%2C29.2%2C35.5z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_28%22%20viewBox%3D%22-4.7%20-2.5%209.4%205%22%3E%0A%0A%09%09%3Cellipse%20transform%3D%22matrix%280.3883%20-0.9215%200.9215%200.3883%201.676236e-12%20-1.112622e-12%29%22%20class%3D%22st2%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%221.7%22%20ry%3D%225.1%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_81%22%20viewBox%3D%22-8%20-9.6%2016%2014.9%22%3E%0A%09%3Cpath%20class%3D%22st3%22%20d%3D%22M-2.6-9.6c-2.1%2C0.1-4%2C1.7-4.9%2C3.8c-0.8%2C1.9-0.7%2C4.6%2C1.7%2C6.4c3.1%2C2.3%2C7%2C3.3%2C9.8%2C3.6c0.1%2C0.1%2C0.3%2C0.3%2C0.4%2C0.4%0A%09%09C4.8%2C4.9%2C5.3%2C5.1%2C5.7%2C5c0.6%2C0%2C1.1-0.3%2C1.6-0.8c0.1%2C0%2C0.1-0.1%2C0.1-0.2C7.5%2C4%2C7.5%2C4%2C7.6%2C3.9C7.9%2C3.4%2C8%2C2.9%2C8%2C2.4C8%2C2%2C7.8%2C1.3%2C7.2%2C0.8%0A%09%09C7.1%2C0.8%2C6.9%2C0.7%2C6.8%2C0.6c-1-2.9-2.9-6.8-6.1-9.1C-0.3-9.3-1.5-9.7-2.6-9.6C-2.6-9.6-2.6-9.6-2.6-9.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st4%22%20d%3D%22M6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6c-0.5%2C0.6-1.3%2C0.9-2%2C0.3C4.6%2C4.8%2C4.4%2C4.6%2C4.3%2C4.5%0A%09%09C1.7%2C4.1-2.4%2C3.2-5.5%2C0.9c-4.9-3.7%2C0.7-11.5%2C5.6-7.7c3.2%2C2.4%2C5%2C6.5%2C5.9%2C9c0.2%2C0.1%2C0.3%2C0.2%2C0.5%2C0.3C7.3%2C3.1%2C7.2%2C4%2C6.8%2C4.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st5%22%20d%3D%22M4.6%2C3.4c0%2C0-1.5-4.2-5.3-6.8s-6.7%2C1.9-3%2C4.4S4.6%2C3.4%2C4.6%2C3.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_82%22%20viewBox%3D%22-6.4%20-7.4%2012.7%2014.7%22%3E%0A%09%3Cpath%20class%3D%22st6%22%20d%3D%22M-1.7%2C6.4c2.2-2%2C5.9%2C3.5%2C6.3-0.7c0.3-2.6%2C3.7-6%2C0.3-8.5c-2.8-2-6-4.4-9.2-4.6c-3-0.2-2.1%2C3.1-0.8%2C4.8%0A%09%09c1.6%2C2.1%2C6.7%2C3.6%2C0.5%2C6.4C-4.9%2C4-5%2C5.6-4.6%2C6.3C-3.7%2C8.2-2.6%2C7-1.7%2C6.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_83%22%20viewBox%3D%22-21.4%20-11%2042.8%2021.9%22%3E%0A%09%3Cellipse%20class%3D%22st7%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2221.4%22%20ry%3D%2211%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22middle%22%20viewBox%3D%22-9.3%20-9.3%2018.7%2018.7%22%3E%0A%09%3Ccircle%20class%3D%22st8%22%20cx%3D%220%22%20cy%3D%220%22%20r%3D%229.3%22%2F%3E%0A%09%3Ccircle%20class%3D%22st9%22%20cx%3D%22-2.7%22%20cy%3D%222.2%22%20r%3D%224.8%22%2F%3E%0A%09%3Ccircle%20class%3D%22st10%22%20cx%3D%22-3.7%22%20cy%3D%223.2%22%20r%3D%222.5%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone3%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_1_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.205665e-02%22%20style%3D%22stop-color%3A%23F7F4F1%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%23CDBCB3%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st11%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_2_%22%20cx%3D%22-7.4167%22%20cy%3D%2211.5833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.9817%20-0.1905%200.11%200.5668%20-1.4098%203.6055%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.2125%22%20style%3D%22stop-color%3A%23FFFFFF%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8374%22%20style%3D%22stop-color%3A%23FFFFFF%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st12%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_3_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1019%22%20style%3D%22stop-color%3A%23C19377%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%23C19377%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st13%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone4%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_4_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%222.963362e-02%22%20style%3D%22stop-color%3A%2398A6B2%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.2213%22%20style%3D%22stop-color%3A%238B9BA9%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7139%22%20style%3D%22stop-color%3A%236F8295%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%2365798D%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st14%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_5_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1609%22%20style%3D%22stop-color%3A%23254058%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4016%22%20style%3D%22stop-color%3A%23354E65%3Bstop-opacity%3A0.8176%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4664%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0.7686%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st15%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_6_%22%20cx%3D%22-10.9167%22%20cy%3D%2214.0833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.997%207.794188e-02%20-4.499866e-02%200.5756%200.6005%206.8281%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1287%22%20style%3D%22stop-color%3A%23DAE4EA%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.3452%22%20style%3D%22stop-color%3A%23D1DBE1%3Bstop-opacity%3A0.6859%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8178%22%20style%3D%22stop-color%3A%23C1CCD2%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st16%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22%D1%8B%D0%B5%D1%89%D1%82%D1%831%22%20viewBox%3D%22-38%20-28.5%2076%2057%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_7_%22%20cx%3D%22-9.75%22%20cy%3D%2213.4167%22%20r%3D%2256.4377%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%202.2799%2010.1643%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%225.041564e-03%22%20style%3D%22stop-color%3A%23ABDF93%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.1414%22%20style%3D%22stop-color%3A%239BCC84%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4983%22%20style%3D%22stop-color%3A%2374A060%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.679%22%20style%3D%22stop-color%3A%23658F52%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st17%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_8_%22%20cx%3D%225.75%22%20cy%3D%22-6.5833%22%20r%3D%2232.95%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%20-1.0393%20-5.3709%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.321%22%20style%3D%22stop-color%3A%234D8035%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.995%22%20style%3D%22stop-color%3A%234D8035%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st18%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_9_%22%20cx%3D%22-9%22%20cy%3D%2213.75%22%20r%3D%2222.0482%22%20gradientTransform%3D%22matrix%280.9129%200.4081%20-0.1887%200.4221%201.8107%2011.6196%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.891172e-02%22%20style%3D%22stop-color%3A%23D7FFC5%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7851%22%20style%3D%22stop-color%3A%23D7FFC5%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st19%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_10_%22%20cx%3D%2234%22%20cy%3D%22-16.3333%22%20r%3D%2261.6988%22%20gradientTransform%3D%22matrix%280.9725%200.2331%20-0.1028%200.4289%20-0.7427%20-17.2516%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220%22%20style%3D%22stop-color%3A%23C1FDAC%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.6442%22%20style%3D%22stop-color%3A%238DB970%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st20%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_2%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_10%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_11%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_12%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_3%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_1%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st27%22%20d%3D%22M171%2C8.2c-1.6-1.4-3.7-2.2-5.9-2.2c-1.9%2C0-3.7%2C0.6-5.3%2C1.7l-1.6%2C1.4c-12.8%2C11.7-29.9%2C19.8-48.5%2C23.2%0A%09%09%09c-3.8-7.1-11.4-12-20-12c-8.6%2C0-16.1%2C4.8-20%2C11.9c-13.8-2.6-26.8-7.7-37.8-15.1c3.3-1.3%2C5.6-4.5%2C5.6-8.3c0-4.9-4-8.9-8.9-8.9%0A%09%09%09L8.7%2C0c-0.5%2C0-1%2C0.1-1.5%2C0.2C7%2C0.2%2C6.9%2C0.2%2C6.8%2C0.3C6.4%2C0.4%2C6%2C0.5%2C5.5%2C0.7c-0.1%2C0-0.2%2C0.1-0.2%2C0.1C4.8%2C1%2C4.4%2C1.2%2C4%2C1.5L3.8%2C1.6%0A%09%09%09C3.6%2C1.8%2C3.3%2C2%2C3.1%2C2.2C2.9%2C2.4%2C2.7%2C2.6%2C2.5%2C2.7C0.8%2C4.5-0.1%2C6.9%2C0%2C9.5l0%2C19.2c0%2C4.9%2C4%2C8.9%2C8.9%2C8.9c4.7%2C0%2C8.6-3.7%2C8.9-8.4%0A%09%09%09C32%2C39.6%2C49.6%2C47%2C68%2C50.2C71%2C59.4%2C79.6%2C66%2C89.7%2C66c10.1%2C0%2C18.6-6.6%2C21.6-15.7c22.8-3.9%2C43.8-13.8%2C59.5-28.4l0.4-0.4%0A%09%09%09c0.2-0.2%2C0.4-0.4%2C0.6-0.6C175%2C17.1%2C174.7%2C11.5%2C171%2C8.2z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M170%2C9.4c-1.4-1.2-3.1-1.8-4.9-1.8c-1.6%2C0-3.1%2C0.5-4.4%2C1.4l-0.6%2C0.5c-0.1%2C0.1-0.3%2C0.3-0.4%2C0.4l-0.4%2C0.4%0A%09%09%09C146%2C22.4%2C128.3%2C30.8%2C109%2C34.1c-3.4-7.2-10.8-12.3-19.3-12.3c-8.5%2C0-15.8%2C5-19.2%2C12.2C54.8%2C31.2%2C40%2C25.1%2C28.1%2C16.4h0.5%0A%09%09%09c4.1%2C0%2C7.4-3.3%2C7.4-7.4c0-4.1-3.3-7.4-7.4-7.4l-19.9%2C0c-0.4%2C0-0.8%2C0.1-1.2%2C0.1c-0.1%2C0-0.2%2C0.1-0.3%2C0.1C6.8%2C1.8%2C6.5%2C1.9%2C6.1%2C2.1%0A%09%09%09C6%2C2.1%2C5.9%2C2.1%2C5.9%2C2.2C5.5%2C2.3%2C5.2%2C2.5%2C4.8%2C2.8L4.7%2C2.9C4.5%2C3%2C4.2%2C3.2%2C4%2C3.3C3.9%2C3.5%2C3.7%2C3.6%2C3.6%2C3.7C2.2%2C5.2%2C1.4%2C7.3%2C1.5%2C9.4%0A%09%09%09l0%2C19.2c0%2C4.1%2C3.3%2C7.4%2C7.4%2C7.4s7.4-3.3%2C7.4-7.4v-2.5c14.6%2C11.5%2C33%2C19.4%2C52.7%2C22.7c2.5%2C9.1%2C10.8%2C15.8%2C20.6%2C15.8%0A%09%09%09c9.8%2C0%2C18.1-6.6%2C20.6-15.7c22.8-3.7%2C43.8-13.6%2C59.5-28.1l0.4-0.4c0.2-0.2%2C0.4-0.4%2C0.5-0.6C173.4%2C16.8%2C173.1%2C12.1%2C170%2C9.4z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st29%22%20d%3D%22M168.7%2C10.9c-1-0.9-2.3-1.3-3.6-1.3c-1.2%2C0-2.3%2C0.4-3.2%2C1.1c-0.4%2C0.4-0.7%2C0.7-1.1%2C1.1c0%2C0-0.1%2C0.1-0.1%2C0.1%0A%09%09%09l0%2C0c-13.7%2C12.6-32.4%2C21.3-52.7%2C24.5c-2.8-7.4-9.9-12.6-18.2-12.6c-8.3%2C0-15.4%2C5.2-18.2%2C12.5c-18.6-3.1-35.9-10.7-49.2-21.8h6.4%0A%09%09%09c3%2C0%2C5.4-2.4%2C5.4-5.4c0-3-2.4-5.4-5.4-5.4l-19.8%2C0c-0.3%2C0-0.6%2C0-0.9%2C0.1c-0.1%2C0-0.2%2C0-0.2%2C0.1C7.4%2C3.7%2C7.1%2C3.8%2C6.9%2C3.9%0A%09%09%09C6.8%2C3.9%2C6.8%2C4%2C6.7%2C4C6.5%2C4.1%2C6.2%2C4.3%2C5.9%2C4.4L5.8%2C4.5C5.6%2C4.6%2C5.5%2C4.7%2C5.3%2C4.9C5.3%2C4.9%2C5.2%2C5%2C5.1%2C5.1L5.1%2C5.1%0A%09%09%09C4%2C6.2%2C3.4%2C7.8%2C3.5%2C9.4l0%2C19.3c0%2C3%2C2.4%2C5.4%2C5.4%2C5.4c3%2C0%2C5.4-2.4%2C5.4-5.4v-6.7c15.1%2C13%2C34.9%2C21.8%2C56.2%2C25.1%0A%09%09%09c1.8%2C8.9%2C9.7%2C15.7%2C19.1%2C15.7c9.4%2C0%2C17.3-6.7%2C19.1-15.6c23-3.5%2C44.1-13.4%2C59.6-27.7c0.3-0.3%2C0.5-0.6%2C0.8-0.9%0A%09%09%09C171.1%2C16.3%2C170.9%2C12.8%2C168.7%2C10.9z%22%2F%3E%0A%09%09%3Cg%3E%0A%09%09%09%3Cg%3E%0A%09%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M96.2%2C51.3c0.4%2C0%2C0.8-0.1%2C1.1-0.4c0.6-0.6%2C0.6-1.5%2C0-2.1L84.1%2C35.5c-0.6-0.6-1.5-0.6-2.1%2C0%0A%09%09%09%09%09c-0.6%2C0.6-0.6%2C1.5%2C0%2C2.1l13.2%2C13.2C95.4%2C51.1%2C95.8%2C51.3%2C96.2%2C51.3z%22%2F%3E%0A%09%09%09%3C%2Fg%3E%0A%09%09%09%3Cg%3E%0A%09%09%09%09%3Cg%3E%0A%09%09%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M81.5%2C49.7c0%2C0.4%2C0.1%2C0.8%2C0.4%2C1.1c0.6%2C0.6%2C1.5%2C0.6%2C2.1%2C0l13.2-13.2c0.6-0.6%2C0.6-1.5%2C0-2.1%0A%09%09%09%09%09%09c-0.6-0.6-1.5-0.6-2.1%2C0L82%2C48.7C81.7%2C49%2C81.5%2C49.4%2C81.5%2C49.7z%22%2F%3E%0A%09%09%09%09%3C%2Fg%3E%0A%09%09%09%3C%2Fg%3E%0A%09%09%3C%2Fg%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_8%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_9%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_4%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_5%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_6%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_7%22%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
	"ui_arrow_refuse_up.svg": "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2022.0.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%20%20%20%20%20width%3D%22174%22%20height%3D%2266%22%0A%09%20viewBox%3D%220%200%20174%2066%22%20style%3D%22enable-background%3Anew%200%200%20174%2066%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%09.st0%7Bopacity%3A0.9%3B%7D%0A%09.st1%7Bfill%3A%23FF833F%3B%7D%0A%09.st2%7Bfill%3A%23EBF2DC%3B%7D%0A%09.st3%7Bopacity%3A0.4%3Bfill%3A%23D45F26%3B%7D%0A%09.st4%7Bfill%3A%23FFC449%3B%7D%0A%09.st5%7Bfill%3A%23FCD578%3B%7D%0A%09.st6%7Bfill%3A%23C26934%3B%7D%0A%09.st7%7Bfill%3A%23F9AA18%3B%7D%0A%09.st8%7Bfill%3A%23D61A3D%3B%7D%0A%09.st9%7Bfill%3A%23EE3457%3B%7D%0A%09.st10%7Bfill%3A%23FF8097%3B%7D%0A%09.st11%7Bfill%3Aurl%28%23SVGID_1_%29%3B%7D%0A%09.st12%7Bfill%3Aurl%28%23SVGID_2_%29%3B%7D%0A%09.st13%7Bfill%3Aurl%28%23SVGID_3_%29%3B%7D%0A%09.st14%7Bfill%3Aurl%28%23SVGID_4_%29%3B%7D%0A%09.st15%7Bfill%3Aurl%28%23SVGID_5_%29%3B%7D%0A%09.st16%7Bfill%3Aurl%28%23SVGID_6_%29%3B%7D%0A%09.st17%7Bfill%3Aurl%28%23SVGID_7_%29%3B%7D%0A%09.st18%7Bfill%3Aurl%28%23SVGID_8_%29%3B%7D%0A%09.st19%7Bfill%3Aurl%28%23SVGID_9_%29%3B%7D%0A%09.st20%7Bfill%3Aurl%28%23SVGID_10_%29%3B%7D%0A%09.st21%7Bfill%3A%23FFFFFF%3B%7D%0A%09.st22%7Bfill%3A%23FF6100%3B%7D%0A%09.st23%7Bopacity%3A0.8%3Bfill%3Aurl%28%23SVGID_11_%29%3B%7D%0A%09.st24%7Bfill%3Aurl%28%23SVGID_12_%29%3B%7D%0A%09.st25%7Bfill%3A%23E0B993%3B%7D%0A%09.st26%7Bfill%3Anone%3Bstroke%3A%23FFFFFF%3Bstroke-width%3A2%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A10%3B%7D%0A%09.st27%7Bopacity%3A0.15%3Bfill%3A%23020202%3B%7D%0A%09.st28%7Bfill%3A%239BCC33%3B%7D%0A%09.st29%7Bfill%3A%23E03D1F%3B%7D%0A%3C%2Fstyle%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_26%22%20viewBox%3D%22-55%20-45.9%20110.1%2091.8%22%3E%0A%09%3Cg%20class%3D%22st0%22%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M42.8-18.5c-0.1%2C2.1%2C0.7%2C3.6%2C2.2%2C5.1c1.7%2C1.6%2C4.1%2C3.6%2C4.2%2C5.5c0.3%2C7.6%2C5.2%2C13.7%2C5.8%2C21.1%0A%09%09%09C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5c-0.4-2.4%2C2-2.1%2C3.5-2.3c1.8-0.2%2C2.3-1.3%2C1.9-2.8%0A%09%09%09c-0.5-2-1.8-1.5-3.1-0.9c-1.5%2C0.7-2.9%2C1.5-4.4%2C2.1c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1c-2-3.1-5.2-2-8-2.3%0A%09%09%09c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c3.7-2.8%2C7.8-2.4%2C11.9-1.4c4%2C0.9%2C8%2C2.1%2C11.8-0.5C42.2-18.5%2C42.5-18.5%2C42.8-18.5z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M49.2%2C20.6c1.8%2C0.4%2C2.1%2C1.7%2C0.6%2C2.2c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2%0A%09%09%09c-0.1-1.3-0.7-2.7-1.8-2.8c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.1-2.9%2C4.3-3.3%2C7.8-3.3c2.5%2C1.8%2C5.1%2C0.6%2C7.1-0.5%0A%09%09%09C18.7-6%2C22.5-6%2C26.4-5.2c1.9%2C5%2C1.4%2C5.6-3.9%2C5c-1.6-0.2-3.2-0.1-4.9-0.3c-1.2-0.1-2.6-0.7-2.9%2C0.9c-0.3%2C1.4%2C1.5%2C1%2C2.2%2C1.6%0A%09%09%09c4.4%2C4.1%2C11.8%2C1.7%2C15.6%2C7.5c1.2%2C1.8%2C3.1%2C3%2C2.5%2C5.6c-0.4%2C1.8%2C0.9%2C2.3%2C2.3%2C2.4C40.4%2C22.3%2C45.1%2C20.2%2C49.2%2C20.6z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-15.1-30c0.6-0.3%2C1.2-0.7%2C1.7-1c2.8-0.4%2C2.5-2.6%2C2.5-4.6c1.7-0.2%2C3.1-0.4%2C1.4-2.6c-1.9-2.5-4.1-4.2-7.3-4.3%0A%09%09%09c-1.4-0.1-3.1-0.8-2.9-2.2c0.2-2%2C2-0.9%2C3.2-0.8C-11-45.2-5.8-43-0.3-43.1c0.9%2C0%2C1.9%2C0.3%2C2%2C1.4c0.1%2C1-0.8%2C1-1.5%2C1.2%0A%09%09%09C-4.4-39.7-2.6-38-0.6-36c1.7%2C1.6%2C3.5%2C2.8%2C5.9%2C2.3c0%2C1.5%2C0.2%2C3%2C1.1%2C4.4c-4%2C3.9-5%2C3.7-7.6-0.8c-1.1-1.9-3-2.9-4.9-1.8%0A%09%09%09c-2.2%2C1.3%2C0.2%2C2.7%2C0.4%2C4c0.3%2C2.3%2C2.9%2C2.5%2C3.4%2C4.4c-1.6%2C0-3.1%2C0.2-4.4%2C1.1C-9-25.4-13.2-26.4-15.1-30z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M13.3-24.2c0.3-1.5%2C1.1-2.7%2C2.6-2.4c1.8%2C0.4%2C4.5-0.3%2C4.9%2C2.6c0.3%2C2.2-1.5%2C2.1-3%2C2.2%0A%09%09%09C15.9-21.6%2C14.1-22%2C13.3-24.2z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M12.8-10.8c-1.1%2C3.2-3.8%2C1.9-5.9%2C1.8C5.4-9%2C6.2-10.5%2C6.5-11.4C8.6-11.2%2C10.8-12.3%2C12.8-10.8z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M6.6%2C11c2.3-0.3%2C5-1.9%2C5.8%2C2.2c0.3%2C1.4%2C2%2C0.9%2C3.1%2C1.3c1.6%2C0.6%2C4.1%2C0.6%2C4.2%2C2.7c0.1%2C2.3-2.9%2C0.6-4.6%2C3.1%0A%09%09%09c4.7-1.8%2C7.3%2C3.7%2C11.9%2C1.1c2.1-1.2%2C3.8%2C1.2%2C4.1%2C2.9c0.5%2C2.4%2C1.7%2C5.2-1.6%2C7.1c-5.3%2C3-8.7%2C4.7-15.8-1.9c-1.6-2.1-4.3-3.3-4.5-6.6%0A%09%09%09c-0.1-1.2-1.9-1.1-3.1-1.1c-0.2-1.7%2C2.3-4.4-1.3-4.7c-1.6-0.1-3.6%2C1.2-5%2C2.3c-1.4%2C1.1-0.8%2C2.3%2C1%2C2.7c-2.7%2C3.3-5.7%2C0.1-6.9-0.9%0A%09%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c2.7%2C0.8%2C4.4-1.7%2C6.7-1.6l0%2C0c4.7%2C5.3%2C6.1%2C5.2%2C8.9-0.5C2.4%2C10.6%2C4.5%2C10.8%2C6.6%2C11z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-9.5-9.7c3%2C0.8%2C3.7%2C2.3%2C1.1%2C4.4c-1.3%2C1-1.9%2C2.1-1.6%2C3.7c-4.4%2C1.1-6%2C3.6-3.5%2C6.3c4%2C4.4-1%2C4.2-2.4%2C4.9%0A%09%09%09c-1.6%2C0.8-4.4-1.2-5.2%2C2.2c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3%0A%09%09%09c-1.2-0.8-2.5-1.5-3.3-2.8c0.1-1.7%2C1.3-1.9%2C2.6-1.9c0.8%2C3.4%2C4.3%2C3.2%2C6.5%2C4.6c1.3%2C0.9%2C1.5-1.1%2C1.5-2.3c1.3-0.1%2C2.7-0.4%2C3.8%2C0.6%0A%09%09%09c0.8%2C0.7%2C1.7%2C2.3%2C2.8%2C0.6c0.9-1.3-0.5-2.1-1.3-2.9c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5%0A%09%09%09c-2.4%2C0.4-4.7-0.3-7-0.7c-0.8-0.1-1.5-0.5-1.5-1.3c0-1%2C0.9-0.9%2C1.6-1.2c1.6-0.7%2C4.9%2C2.5%2C4.6-1.5c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09%09c-0.8-1-2.7-0.8-2.8-2.6c2.1-1.8%2C7.5-1.3%2C9.4%2C1.3c2%2C2.7%2C4.2%2C3.7%2C7.5%2C3.4c2.6-0.3%2C4.9%2C1.8%2C7.1%2C2.9c3.4%2C1.7%2C7.5%2C1.6%2C10.5%2C4.3%0A%09%09%09c1.3%2C1.2%2C3.1%2C0.6%2C4.7%2C0.6C-13.7-6.9-12.1-6.8-9.5-9.7z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-16.5c-0.7%2C1-2.6%2C0.9-2.5%2C2.7c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1%0A%09%09%09c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.7-3%2C4.9-4.9%2C7.7-3.3c3.2%2C1.8%2C4.2-0.2%2C4.9-2.8c1-0.3%2C2.1-0.6%2C0.8-1.8c0.4-2.1%2C1.1-3.5%2C3.5-2%0A%09%09%09C-18.5-25-17.3-20.6-14.4-16.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-36.9-37.9c4.2-0.5%2C3.5%2C3.5%2C5.7%2C5.9c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4%0A%09%09%09c-0.7-1.1-4.1-2.1-1.9-3.1c3-1.4%2C6-5.3%2C10.1-2.6c1.3%2C0.8%2C0.2%2C1.4-0.7%2C1.7c-1%2C0.2-2.6-0.3-2.8%2C0.8C-40.1-38.9-38-38.7-36.9-37.9z%22%0A%09%09%09%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-30.6%2C19.1c0.1-1.1%2C0.3-2.2%2C1.6-2.4c1.3-0.2%2C1.7%2C0.9%2C2.2%2C1.8c0.6%2C1%2C0.6%2C2-0.5%2C2.7c-4.1%2C2.8-0.4%2C3.2%2C1.3%2C3.8%0A%09%09%09c1.4%2C0.5%2C3.3%2C0.2%2C2.6%2C2.4c-0.6%2C1.8-2.9%2C1.7-3.7%2C0.8c-2.3-2.4-7.8-1.8-7-7.2C-32.5%2C21.1-31.2%2C20.7-30.6%2C19.1z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-34.5c-5.3%2C0.5-10.5%2C0.9-15-2.5c4.1-1.7%2C8.5-1.6%2C12.9-1.8c0.2%2C1.1%2C0.8%2C1.6%2C1.9%2C1.7l0%2C0%0A%09%09%09C-14.5-36.3-14.4-35.4-14.4-34.5z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.5%2C42.6c-0.9-0.1-1.8-0.3-2.3-1.1c-1.7-2.9-3-6.4-7.5-3.1c-1%2C0.7-2.3-0.5-2.5-1.8%0A%09%09%09c-0.3-1.6%2C1.2-1.4%2C2.1-1.6c6.1-0.8%2C12-3.3%2C18.3-0.9c0.6%2C0.2%2C1.6%2C0%2C1.7%2C1c0.1%2C1.1-0.9%2C1.4-1.7%2C1.6c-0.4%2C0.1-0.9%2C0.1-1.3%2C0.2%0A%09%09%09c-1.3%2C0.3-3.7-0.5-3.7%2C1.4c0%2C2.2%2C2.6%2C1.8%2C4.2%2C2.2c1.9%2C0.4%2C4.9-1.3%2C5.5%2C1.3c0.5%2C2.4-2.9%2C1.8-4.4%2C2.8c-0.8%2C0.6-1.8%2C1-2.7%2C1.4%0A%09%09%09c-0.2-1.4%2C1.6-3.1-0.2-4C43.2%2C41%2C41.1%2C41.1%2C39.5%2C42.6z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39-3.9c-0.1%2C0.3-0.2%2C0.7-0.1%2C1.2c0.4%2C2.4%2C2.3%2C5%2C4.7%2C4.5c4.8-1%2C3.9%2C2.1%2C4.2%2C4.6c2.5%2C1.3%2C4.5%2C3.4%2C6.9%2C4.8%0A%09%09c0.1%2C0.7%2C0.2%2C1.4%2C0.3%2C2.1C51.5%2C12%2C49.1%2C9%2C45.9%2C7.3c-0.3-2.5%2C0.6-5.6-4.2-4.6c-2.4%2C0.5-4.3-2.1-4.7-4.5C36.6-3.5%2C37.8-3.8%2C39-3.9z%22%0A%09%09%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M20.1-17.6c-0.7%2C0.5-1.7%2C0.9-1.4%2C2c0.4%2C1.1%2C1.5%2C0.7%2C2.3%2C0.8c2.8%2C0.3%2C6-0.8%2C8%2C2.3c1.8%2C0.2%2C2.6%2C1.6%2C2.7%2C3.1%0A%09%09c0.2%2C4%2C2.4%2C3.8%2C5.1%2C2.7c0.6-0.2%2C1.1-0.5%2C1.6-0.7c-1.2%2C0.6-2.4%2C1.2-3.6%2C1.7c-2.7%2C1-5%2C1.3-5.1-2.7c-0.1-1.5-0.9-2.9-2.7-3.1%0A%09%09c-2-3.1-5.2-2-8-2.3c-0.8-0.1-2%2C0.3-2.3-0.8c-0.3-1.1%2C0.7-1.5%2C1.4-2c0.9-0.7%2C1.8-1.1%2C2.7-1.5C20.6-17.9%2C20.3-17.7%2C20.1-17.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M7%2C0.3c2.2%2C5%2C6.7%2C6.2%2C10.4%2C8.2c5.4%2C2.9%2C9.2%2C8.5%2C15.8%2C9.1c1.1%2C0.1%2C1.8%2C1.5%2C1.8%2C2.8c0.1%2C3.4%2C2.9%2C4.5%2C5.3%2C4.2%0A%09%09c3.5-0.3%2C6.9-1.4%2C10.2-2.5c-0.2%2C0.2-0.4%2C0.4-0.9%2C0.6c-3.7%2C1.3-7.5%2C2.5-11.4%2C2.9c-2.3%2C0.2-5.1-0.8-5.3-4.2c-0.1-1.3-0.7-2.7-1.8-2.8%0A%09%09c-6.7-0.6-10.5-6.3-15.8-9.1C11.7%2C7.5%2C7.1%2C6.4%2C5%2C1.3C3.4-2.2%2C4-3%2C6.2-3.3C6-2.6%2C6.2-1.5%2C7%2C0.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-17.7-45.7c-0.2%2C1.4%2C1.5%2C2.1%2C2.9%2C2.2c3.2%2C0.2%2C5.4%2C1.9%2C7.3%2C4.3c1.6%2C2.1%2C0.4%2C2.4-1.2%2C2.6c0-0.4-0.2-0.9-0.8-1.6%0A%09%09c-1.9-2.5-4.1-4.2-7.3-4.3c-1.4-0.1-3.1-0.8-2.9-2.2C-19.5-46.1-18.6-46-17.7-45.7C-17.7-45.7-17.7-45.7-17.7-45.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-13-31c0%2C0-0.1%2C0-0.1%2C0.1c1.9%2C3.6%2C6.1%2C4.6%2C8.5%2C7.6c0.7-0.4%2C1.3-0.7%2C2.1-0.9c0.1%2C0.2%2C0.3%2C0.5%2C0.3%2C0.7%0A%09%09c-1.6%2C0-3.1%2C0.2-4.4%2C1.1c-2.4-3-6.6-4.1-8.5-7.6c0.6-0.3%2C1.2-0.7%2C1.7-1C-13.2-31-13.1-31-13-31z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M15.3-25.2c0.8%2C2.2%2C2.6%2C2.6%2C4.6%2C2.4c0.3%2C0%2C0.6%2C0%2C0.9-0.1c-0.4%2C1-1.7%2C1-2.9%2C1.1c-2%2C0.2-3.8-0.2-4.6-2.4%0A%09%09c0.3-1.4%2C1.1-2.7%2C2.5-2.4C15.6-26.2%2C15.4-25.7%2C15.3-25.2z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M8.9-9.9c1%2C0.1%2C2.2%2C0.4%2C3.3%2C0.3c-1.3%2C1.7-3.5%2C0.8-5.3%2C0.7C5.4-9%2C6.2-10.5%2C6.5-11.4c0.6%2C0.1%2C1.1%2C0%2C1.7%2C0%0A%09%09C7.9-10.7%2C7.9-10%2C8.9-9.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M4.9%2C17.1c-0.5%2C0-1%2C0.1-1.5%2C0.2c1.1-0.7%2C2.4-1.3%2C3.5-1.2c3.6%2C0.3%2C1.2%2C3%2C1.3%2C4.7c1.2%2C0%2C3-0.1%2C3.1%2C1.1%0A%09%09c0.2%2C3.2%2C2.8%2C4.5%2C4.5%2C6.6c5.5%2C5.2%2C8.8%2C5.3%2C12.5%2C3.7c-4.6%2C2.5-8%2C3.4-14.5-2.7c-1.6-2.1-4.3-3.3-4.5-6.6c-0.1-1.2-1.9-1.1-3.1-1.1%0A%09%09C6.1%2C20.1%2C8.5%2C17.3%2C4.9%2C17.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4%2C13.8c2.7%2C3.3%2C7.3%2C3.5%2C10.5%2C6.3c0.8%2C0.7%2C2.6%2C2.5%2C4.5%2C2.4C-2.1%2C25-4.9%2C22.1-6%2C21.1%0A%09%09c-3.2-2.8-7.8-3-10.5-6.3c0-1%2C0-2.8%2C1.2-2.4c0.3%2C0.1%2C0.6%2C0.1%2C0.9%2C0.1C-14.4%2C13-14.4%2C13.5-14.4%2C13.8z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-33.1-6.7c-0.1%2C0.2-0.2%2C0.5-0.2%2C0.9c0.8%2C1.3%2C2%2C2%2C3.3%2C2.8c1.4%2C0.9%2C1.5%2C1.8-0.3%2C2.3c0.1%2C4.3%2C3.9%2C4.5%2C6.6%2C6%0A%09%09c2.1%2C0.3%2C1.9%2C2%2C1.8%2C3.4c-0.1%2C1.2%2C0.5%2C1.7%2C1.2%2C2c-0.2%2C0.3-0.3%2C0.6-0.4%2C1.1c0%2C0.1-3%2C0.4-2.8-2.1c0.1-1.5%2C0.3-3.1-1.8-3.4%0A%09%09c-2.7-1.4-6.5-1.7-6.6-6c1.8-0.5%2C1.7-1.4%2C0.3-2.3c-1.2-0.8-2.5-1.5-3.3-2.8C-35.2-6.3-34.3-6.6-33.1-6.7z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.2-21.1c3.8-0.7%2C6%2C1.9%2C6.2%2C4.7c0.2%2C2.2-0.8%2C2.2-2%2C1.8c0-0.2%2C0-0.5%2C0-0.8c-0.2-2.9-2.4-5.5-6.2-4.7%0A%09%09c-0.8-1-2.7-0.8-2.8-2.6c0.5-0.4%2C1.2-0.7%2C2-0.9C-52.8-21.9-51-22.1-50.2-21.1z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-50.6-13.9c0.1-0.1%2C0.3-0.1%2C0.5-0.1c0%2C0.1%2C0%2C0.2%2C0%2C0.3c0%2C0.8%2C0.8%2C1.2%2C1.5%2C1.3c2.3%2C0.4%2C4.6%2C1.1%2C7%2C0.7%0A%09%09c2.5-1.1%2C5-2.4%2C6.3%2C1.5c0.9%2C0.1%2C2%2C0.6%2C2.6%2C0.2c5.4-2.9%2C10.6-2%2C15.4%2C2.9c0.8%2C0.8%2C2.2%2C1.6%2C1.3%2C2.9c-0.7%2C1-1.2%2C0.8-1.7%2C0.4%0A%09%09c0.2-1-0.9-1.6-1.6-2.3c-4.8-4.9-10-5.8-15.4-2.9c-0.6%2C0.3-1.7-0.1-2.6-0.2c-1.3-4-3.8-2.6-6.3-1.5c-2.4%2C0.4-4.7-0.3-7-0.7%0A%09%09c-0.8-0.1-1.5-0.5-1.5-1.3C-52.2-13.7-51.3-13.6-50.6-13.9z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-31.7-21c-0.3%2C1.4%2C0.5%2C1.7%2C1.5%2C1.2c4.8-2.8%2C8%2C0.8%2C11.2%2C3.1c0.9%2C0.6%2C1.6%2C1.4%2C2.5%2C1.8%0A%09%09%09c-0.2%2C0.3-0.4%2C0.6-0.4%2C1.2c-1.8%2C0.3-2.8-1-4.1-1.9c-3.3-2.3-6.4-5.9-11.2-3.1c-0.9%2C0.5-1.8%2C0.2-1.5-1.2c0.4-1.8%2C2-3.1%2C3.8-3.6%0A%09%09%09C-30.8-22.9-31.5-22-31.7-21z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-18.3-28.9c1.3%2C1.3%2C0.2%2C1.5-0.8%2C1.8c-0.5%2C2-1.2%2C3.6-3%2C3.5c0.4-0.6%2C0.7-1.5%2C1-2.5c1-0.3%2C2.1-0.6%2C0.8-1.8%0A%09%09%09c0.3-1.7%2C0.8-3%2C2.4-2.5C-18.1-30-18.3-29.5-18.3-28.9z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-44.5-41.5c-2.3%2C1%2C1.2%2C2%2C1.9%2C3.1c0.7%2C1.2%2C0.2%2C2.3%2C0.1%2C3.4c-0.3%2C2.1%2C0.7%2C4.1%2C2.8%2C3.3c2.5-1%2C5-1.2%2C7.8-1.3%0A%09%09c0.2%2C0.3%2C0.4%2C0.7%2C0.7%2C1c-4%2C0.1-7.3%2C0-10.5%2C1.3c-2%2C0.8-3.1-1.2-2.8-3.3c0.2-1.2%2C0.7-2.2-0.1-3.4c-0.7-1.1-4.1-2.1-1.9-3.1%0A%09%09c1.8-0.8%2C3.6-2.5%2C5.6-3.2C-42.2-42.9-43.3-42-44.5-41.5z%22%2F%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-25.1%2C27.3c0.3%2C0.4%2C0.9%2C0.6%2C1.5%2C0.6c-0.8%2C1.4-2.7%2C1.2-3.5%2C0.4c-2.3-2.4-7.8-1.8-7-7.2c0.7%2C0%2C1.4-0.1%2C1.9-0.4%0A%09%09%09C-32.4%2C25.4-27.2%2C24.9-25.1%2C27.3z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-28.6%2C18.1c-0.5%2C1.3-1.4%2C1.7-2.5%2C1.9c0.2-0.2%2C0.4-0.5%2C0.5-0.9c0.1-1.1%2C0.3-2.2%2C1.6-2.4c0.3%2C0%2C0.5%2C0%2C0.7%2C0.1%0A%09%09%09C-28.5%2C17.2-28.5%2C17.7-28.6%2C18.1z%22%2F%3E%0A%09%3C%2Fg%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M-14.4-35.3c0%2C0.3%2C0%2C0.5%2C0%2C0.8c-5.3%2C0.5-10.5%2C0.9-15-2.5c0.8-0.3%2C1.5-0.6%2C2.3-0.8%0A%09%09C-23.2-35.1-18.9-35-14.4-35.3z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M39.2%2C40.4c0.4%2C0.8%2C1.3%2C1%2C2.1%2C1.1c-0.6%2C0.2-1.2%2C0.5-1.8%2C1c-0.9-0.1-1.8-0.3-2.3-1.1c-1.4-2.3-2.5-5-5.1-4.3%0A%09%09C36.3%2C34.2%2C37.5%2C37.6%2C39.2%2C40.4z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M46.9%2C40.9c1.8%2C0.9%2C0%2C2.6%2C0.2%2C4c-0.7%2C0.4-1.3%2C0.7-2%2C1c-0.2-1.4%2C1.6-3.1-0.2-4c-1-0.5-2.1-0.7-3.2-0.4%0A%09%09C43.3%2C40.1%2C45.2%2C40%2C46.9%2C40.9z%22%2F%3E%0A%09%3Cpath%20class%3D%22st1%22%20d%3D%22M29.2%2C35.5c0.2%2C1%2C1%2C1.9%2C1.7%2C2c-0.4%2C0.2-0.8%2C0.5-1.2%2C0.8c-1%2C0.7-2.3-0.5-2.5-1.8c-0.3-1.6%2C1-1.5%2C2-1.6%0A%09%09C29.2%2C35.1%2C29.2%2C35.3%2C29.2%2C35.5z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_28%22%20viewBox%3D%22-4.7%20-2.5%209.4%205%22%3E%0A%0A%09%09%3Cellipse%20transform%3D%22matrix%280.3883%20-0.9215%200.9215%200.3883%201.676236e-12%20-1.112622e-12%29%22%20class%3D%22st2%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%221.7%22%20ry%3D%225.1%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_81%22%20viewBox%3D%22-8%20-9.6%2016%2014.9%22%3E%0A%09%3Cpath%20class%3D%22st3%22%20d%3D%22M-2.6-9.6c-2.1%2C0.1-4%2C1.7-4.9%2C3.8c-0.8%2C1.9-0.7%2C4.6%2C1.7%2C6.4c3.1%2C2.3%2C7%2C3.3%2C9.8%2C3.6c0.1%2C0.1%2C0.3%2C0.3%2C0.4%2C0.4%0A%09%09C4.8%2C4.9%2C5.3%2C5.1%2C5.7%2C5c0.6%2C0%2C1.1-0.3%2C1.6-0.8c0.1%2C0%2C0.1-0.1%2C0.1-0.2C7.5%2C4%2C7.5%2C4%2C7.6%2C3.9C7.9%2C3.4%2C8%2C2.9%2C8%2C2.4C8%2C2%2C7.8%2C1.3%2C7.2%2C0.8%0A%09%09C7.1%2C0.8%2C6.9%2C0.7%2C6.8%2C0.6c-1-2.9-2.9-6.8-6.1-9.1C-0.3-9.3-1.5-9.7-2.6-9.6C-2.6-9.6-2.6-9.6-2.6-9.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st4%22%20d%3D%22M6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6C6.8%2C4.6%2C6.8%2C4.6%2C6.8%2C4.6c-0.5%2C0.6-1.3%2C0.9-2%2C0.3C4.6%2C4.8%2C4.4%2C4.6%2C4.3%2C4.5%0A%09%09C1.7%2C4.1-2.4%2C3.2-5.5%2C0.9c-4.9-3.7%2C0.7-11.5%2C5.6-7.7c3.2%2C2.4%2C5%2C6.5%2C5.9%2C9c0.2%2C0.1%2C0.3%2C0.2%2C0.5%2C0.3C7.3%2C3.1%2C7.2%2C4%2C6.8%2C4.6z%22%2F%3E%0A%09%3Cpath%20class%3D%22st5%22%20d%3D%22M4.6%2C3.4c0%2C0-1.5-4.2-5.3-6.8s-6.7%2C1.9-3%2C4.4S4.6%2C3.4%2C4.6%2C3.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_82%22%20viewBox%3D%22-6.4%20-7.4%2012.7%2014.7%22%3E%0A%09%3Cpath%20class%3D%22st6%22%20d%3D%22M-1.7%2C6.4c2.2-2%2C5.9%2C3.5%2C6.3-0.7c0.3-2.6%2C3.7-6%2C0.3-8.5c-2.8-2-6-4.4-9.2-4.6c-3-0.2-2.1%2C3.1-0.8%2C4.8%0A%09%09c1.6%2C2.1%2C6.7%2C3.6%2C0.5%2C6.4C-4.9%2C4-5%2C5.6-4.6%2C6.3C-3.7%2C8.2-2.6%2C7-1.7%2C6.4z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22New_Symbol_83%22%20viewBox%3D%22-21.4%20-11%2042.8%2021.9%22%3E%0A%09%3Cellipse%20class%3D%22st7%22%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%2221.4%22%20ry%3D%2211%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22middle%22%20viewBox%3D%22-9.3%20-9.3%2018.7%2018.7%22%3E%0A%09%3Ccircle%20class%3D%22st8%22%20cx%3D%220%22%20cy%3D%220%22%20r%3D%229.3%22%2F%3E%0A%09%3Ccircle%20class%3D%22st9%22%20cx%3D%22-2.7%22%20cy%3D%222.2%22%20r%3D%224.8%22%2F%3E%0A%09%3Ccircle%20class%3D%22st10%22%20cx%3D%22-3.7%22%20cy%3D%223.2%22%20r%3D%222.5%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone3%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_1_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.205665e-02%22%20style%3D%22stop-color%3A%23F7F4F1%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%23CDBCB3%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st11%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_2_%22%20cx%3D%22-7.4167%22%20cy%3D%2211.5833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.9817%20-0.1905%200.11%200.5668%20-1.4098%203.6055%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.2125%22%20style%3D%22stop-color%3A%23FFFFFF%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8374%22%20style%3D%22stop-color%3A%23FFFFFF%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st12%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_3_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1019%22%20style%3D%22stop-color%3A%23C19377%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%23C19377%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st13%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22stone4%22%20viewBox%3D%22-34.1%20-25.7%2068.2%2051.4%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_4_%22%20cx%3D%22-8.75%22%20cy%3D%2216.75%22%20r%3D%2246.9596%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1484%200.558%20-2.7787%205.1559%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%222.963362e-02%22%20style%3D%22stop-color%3A%2398A6B2%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.2213%22%20style%3D%22stop-color%3A%238B9BA9%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7139%22%20style%3D%22stop-color%3A%236F8295%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%221%22%20style%3D%22stop-color%3A%2365798D%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st14%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_5_%22%20cx%3D%2212.1667%22%20cy%3D%22-6.9167%22%20r%3D%2241.4773%22%20gradientTransform%3D%22matrix%280.9664%20-0.257%200.1244%200.468%201.2693%20-0.5531%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1609%22%20style%3D%22stop-color%3A%23254058%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4016%22%20style%3D%22stop-color%3A%23354E65%3Bstop-opacity%3A0.8176%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4664%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0.7686%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8621%22%20style%3D%22stop-color%3A%233A5369%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st15%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_6_%22%20cx%3D%22-10.9167%22%20cy%3D%2214.0833%22%20r%3D%2221.817%22%20gradientTransform%3D%22matrix%280.997%207.794188e-02%20-4.499866e-02%200.5756%200.6005%206.8281%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.1287%22%20style%3D%22stop-color%3A%23DAE4EA%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.3452%22%20style%3D%22stop-color%3A%23D1DBE1%3Bstop-opacity%3A0.6859%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.8178%22%20style%3D%22stop-color%3A%23C1CCD2%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st16%22%20d%3D%22M33.7-14.3c-3.2-15.2-16.4-13-34.1-6.3C-21-12.8-33.8-5.3-34.1%2C3.1c-0.7%2C16.6%2C12.5%2C26.4%2C33.6%2C21.2%0A%09%09C19%2C19.5%2C37.1%2C1.9%2C33.7-14.3z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Csymbol%20%20id%3D%22%D1%8B%D0%B5%D1%89%D1%82%D1%831%22%20viewBox%3D%22-38%20-28.5%2076%2057%22%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_7_%22%20cx%3D%22-9.75%22%20cy%3D%2213.4167%22%20r%3D%2256.4377%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%202.2799%2010.1643%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%225.041564e-03%22%20style%3D%22stop-color%3A%23ABDF93%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.1414%22%20style%3D%22stop-color%3A%239BCC84%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.4983%22%20style%3D%22stop-color%3A%2374A060%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.679%22%20style%3D%22stop-color%3A%23658F52%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st17%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_8_%22%20cx%3D%225.75%22%20cy%3D%22-6.5833%22%20r%3D%2232.95%22%20gradientTransform%3D%22matrix%280.9178%200.397%20-0.2297%200.5309%20-1.0393%20-5.3709%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220.321%22%20style%3D%22stop-color%3A%234D8035%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.995%22%20style%3D%22stop-color%3A%234D8035%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st18%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_9_%22%20cx%3D%22-9%22%20cy%3D%2213.75%22%20r%3D%2222.0482%22%20gradientTransform%3D%22matrix%280.9129%200.4081%20-0.1887%200.4221%201.8107%2011.6196%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%229.891172e-02%22%20style%3D%22stop-color%3A%23D7FFC5%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.7851%22%20style%3D%22stop-color%3A%23D7FFC5%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st19%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%0A%09%09%3CradialGradient%20id%3D%22SVGID_10_%22%20cx%3D%2234%22%20cy%3D%22-16.3333%22%20r%3D%2261.6988%22%20gradientTransform%3D%22matrix%280.9725%200.2331%20-0.1028%200.4289%20-0.7427%20-17.2516%29%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%0A%09%09%3Cstop%20%20offset%3D%220%22%20style%3D%22stop-color%3A%23C1FDAC%22%2F%3E%0A%09%09%3Cstop%20%20offset%3D%220.6442%22%20style%3D%22stop-color%3A%238DB970%3Bstop-opacity%3A0%22%2F%3E%0A%09%3C%2FradialGradient%3E%0A%09%3Cpath%20class%3D%22st20%22%20d%3D%22M-8.7%2C26c20.4%2C7.8%2C40.4-4.5%2C45.2-17.2s-3-25.6-23.3-33.5s-45.3-3.5-50.2%2C9.1S-29%2C18.2-8.7%2C26z%22%2F%3E%0A%3C%2Fsymbol%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_2%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_10%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_11%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_12%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_3%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_1%22%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20class%3D%22st27%22%20d%3D%22M3%2C57.8C4.7%2C59.2%2C6.8%2C60%2C8.9%2C60c1.9%2C0%2C3.7-0.6%2C5.3-1.7l1.6-1.4C28.5%2C45.1%2C45.6%2C37%2C64.3%2C33.6%0A%09%09%09c3.8%2C7.1%2C11.4%2C12%2C20%2C12c8.6%2C0%2C16.1-4.8%2C20-11.9c13.8%2C2.6%2C26.8%2C7.7%2C37.8%2C15.1c-3.3%2C1.3-5.6%2C4.5-5.6%2C8.3c0%2C4.9%2C4%2C8.9%2C8.9%2C8.9l19.9%2C0%0A%09%09%09c0.5%2C0%2C1-0.1%2C1.5-0.2c0.2%2C0%2C0.3-0.1%2C0.4-0.1c0.4-0.1%2C0.9-0.2%2C1.3-0.4c0.1%2C0%2C0.2-0.1%2C0.2-0.1c0.5-0.2%2C0.9-0.4%2C1.3-0.7l0.1-0.1%0A%09%09%09c0.3-0.2%2C0.5-0.4%2C0.8-0.6c0.2-0.2%2C0.4-0.3%2C0.5-0.5c1.7-1.8%2C2.7-4.2%2C2.5-6.7l0-19.2c0-4.9-4-8.9-8.9-8.9c-4.7%2C0-8.6%2C3.7-8.9%2C8.4%0A%09%09%09C142%2C26.4%2C124.4%2C19%2C106%2C15.8C103%2C6.6%2C94.4%2C0%2C84.3%2C0C74.3%2C0%2C65.7%2C6.6%2C62.7%2C15.7C39.9%2C19.6%2C18.9%2C29.5%2C3.2%2C44.1l-0.4%2C0.4%0A%09%09%09c-0.2%2C0.2-0.4%2C0.4-0.6%2C0.6C-1%2C48.9-0.7%2C54.5%2C3%2C57.8z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M4%2C56.6c1.4%2C1.2%2C3.1%2C1.8%2C4.9%2C1.8c1.6%2C0%2C3.1-0.5%2C4.4-1.4l0.6-0.5c0.1-0.1%2C0.3-0.3%2C0.4-0.4l0.4-0.4%0A%09%09%09C28%2C43.6%2C45.7%2C35.2%2C65%2C31.9c3.4%2C7.2%2C10.8%2C12.3%2C19.3%2C12.3c8.5%2C0%2C15.8-5%2C19.2-12.2c15.7%2C2.8%2C30.4%2C8.9%2C42.3%2C17.6h-0.5%0A%09%09%09c-4.1%2C0-7.4%2C3.3-7.4%2C7.4c0%2C4.1%2C3.3%2C7.4%2C7.4%2C7.4l19.9%2C0c0.4%2C0%2C0.8-0.1%2C1.2-0.1c0.1%2C0%2C0.2-0.1%2C0.3-0.1c0.4-0.1%2C0.7-0.2%2C1.1-0.3%0A%09%09%09c0.1%2C0%2C0.1-0.1%2C0.2-0.1c0.4-0.2%2C0.7-0.4%2C1.1-0.6l0.1-0.1c0.2-0.1%2C0.4-0.3%2C0.6-0.5c0.2-0.1%2C0.3-0.3%2C0.4-0.4%0A%09%09%09c1.5-1.5%2C2.3-3.6%2C2.1-5.7l0-19.2c0-4.1-3.3-7.4-7.4-7.4s-7.4%2C3.3-7.4%2C7.4v2.5c-14.6-11.5-33-19.4-52.7-22.7%0A%09%09%09C102.4%2C8.1%2C94.2%2C1.4%2C84.3%2C1.4C74.5%2C1.4%2C66.3%2C8%2C63.8%2C17C40.9%2C20.8%2C20%2C30.6%2C4.3%2C45.1l-0.4%2C0.4c-0.2%2C0.2-0.4%2C0.4-0.5%2C0.6%0A%09%09%09C0.6%2C49.2%2C0.9%2C53.9%2C4%2C56.6z%22%2F%3E%0A%09%09%3Cpath%20class%3D%22st29%22%20d%3D%22M5.3%2C55.1c1%2C0.9%2C2.3%2C1.3%2C3.6%2C1.3c1.2%2C0%2C2.3-0.4%2C3.2-1.1c0.4-0.4%2C0.7-0.7%2C1.1-1.1c0%2C0%2C0.1-0.1%2C0.1-0.1l0%2C0%0A%09%09%09c13.7-12.6%2C32.4-21.3%2C52.7-24.5c2.8%2C7.4%2C9.9%2C12.6%2C18.2%2C12.6c8.3%2C0%2C15.4-5.2%2C18.2-12.5c18.6%2C3.1%2C35.9%2C10.7%2C49.2%2C21.8h-6.4%0A%09%09%09c-3%2C0-5.4%2C2.4-5.4%2C5.4c0%2C3%2C2.4%2C5.4%2C5.4%2C5.4l19.8%2C0c0.3%2C0%2C0.6%2C0%2C0.9-0.1c0.1%2C0%2C0.2%2C0%2C0.2-0.1c0.3-0.1%2C0.6-0.1%2C0.8-0.3%0A%09%09%09c0.1%2C0%2C0.1%2C0%2C0.1-0.1c0.3-0.1%2C0.5-0.3%2C0.8-0.4l0.1-0.1c0.1-0.1%2C0.3-0.2%2C0.5-0.3c0.1-0.1%2C0.1-0.1%2C0.2-0.2l0.1-0.1%0A%09%09%09c1.1-1.1%2C1.7-2.6%2C1.5-4.2l0-19.3c0-3-2.4-5.4-5.4-5.4c-3%2C0-5.4%2C2.4-5.4%2C5.4v6.7c-15.1-13-34.9-21.8-56.2-25.1%0A%09%09%09C101.7%2C10%2C93.8%2C3.3%2C84.3%2C3.3c-9.4%2C0-17.3%2C6.7-19.1%2C15.6c-23%2C3.5-44.1%2C13.4-59.6%2C27.7c-0.3%2C0.3-0.5%2C0.6-0.8%2C0.9%0A%09%09%09C2.9%2C49.7%2C3.1%2C53.2%2C5.3%2C55.1z%22%2F%3E%0A%09%09%3Cg%3E%0A%09%09%09%3Cg%3E%0A%09%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M91.2%2C31.2c0.4%2C0%2C0.8-0.1%2C1.1-0.4c0.6-0.6%2C0.6-1.5%2C0-2.1L79.1%2C15.5c-0.6-0.6-1.5-0.6-2.1%2C0%0A%09%09%09%09%09c-0.6%2C0.6-0.6%2C1.5%2C0%2C2.1l13.2%2C13.2C90.4%2C31.1%2C90.8%2C31.2%2C91.2%2C31.2z%22%2F%3E%0A%09%09%09%3C%2Fg%3E%0A%09%09%09%3Cg%3E%0A%09%09%09%09%3Cg%3E%0A%09%09%09%09%09%3Cpath%20class%3D%22st21%22%20d%3D%22M76.5%2C29.7c0%2C0.4%2C0.1%2C0.8%2C0.4%2C1.1c0.6%2C0.6%2C1.5%2C0.6%2C2.1%2C0l13.2-13.2c0.6-0.6%2C0.6-1.5%2C0-2.1%0A%09%09%09%09%09%09c-0.6-0.6-1.5-0.6-2.1%2C0L77%2C28.6C76.7%2C28.9%2C76.5%2C29.3%2C76.5%2C29.7z%22%2F%3E%0A%09%09%09%09%3C%2Fg%3E%0A%09%09%09%3C%2Fg%3E%0A%09%09%3C%2Fg%3E%0A%09%3C%2Fg%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_8%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_9%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_4%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_5%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_6%22%3E%0A%3C%2Fg%3E%0A%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_7%22%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
	"ui_game_roll_big_arrow.svg": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2260%22%20height%3D%2222%22%20viewBox%3D%220%200%2060%2022%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20id%3D%22b%22%20d%3D%22M46.907%2010.241h.032a5.417%205.417%200%200%200-1.722-.886.434.434%200%200%200-.338.047.48.48%200%200%200-.228.259.496.496%200%200%200%20.053.338.46.46%200%200%200%20.254.227%204.661%204.661%200%200%201%201.431.754%207.14%207.14%200%200%201%201.385%201.22c.453.496.972.93%201.542%201.287.51.306%201.004.637%201.48.993.449.316.892.665%201.336%201.055.444.39.935.818%201.384%201.225.4.367.698.83.867%201.345.034.116.117.21.227.259.109.057.236.068.354.032a.412.412%200%200%200%20.253-.222.443.443%200%200%200%20.037-.354%204.058%204.058%200%200%200-1.13-1.736c-.45-.412-.92-.823-1.395-1.24a15.95%2015.95%200%200%200-1.416-1.093h.069c-.45-.332-.962-.675-1.543-1.024a6.808%206.808%200%200%201-1.352-1.124c-.467-.522-1-.982-1.585-1.367l.005.005zM33.906%206.283l1.77.19a2.31%202.31%200%200%201%201.415.528%203.32%203.32%200%200%200%201.865.834c.645.1%201.273.216%201.897.353a3.859%203.859%200%200%201%201.48.581c.528.355%201.08.675%201.653.955a.418.418%200%200%200%20.354.032.407.407%200%200%200%20.253-.222.417.417%200%200%200%20.032-.353.486.486%200%200%200-.238-.275c-.527-.254-1.039-.54-1.532-.855a4.652%204.652%200%200%200-1.801-.707c-.645-.143-1.3-.259-1.966-.354a2.558%202.558%200%200%201-1.384-.612%203.097%203.097%200%200%200-1.96-.802l-1.738-.164a.439.439%200%200%200-.322.1.485.485%200%200%200-.175.307.48.48%200%200%200%20.111.332c.07.092.176.151.291.164l-.005-.032zm-19.664.306a.455.455%200%200%200-.354%200c-.296.1-.85.306-1.653.623s-1.384.554-1.818.691c-.458.146-.925.26-1.4.338-.528.08-1.12.2-1.738.354-.668.195-1.31.47-1.912.818-.52.331-1.07.612-1.643.839a5.718%205.718%200%200%200-1.701.96.528.528%200%200%200-.18.307.485.485%200%200%200%20.095.322.45.45%200%200%200%20.307.174.428.428%200%200%200%20.338-.08c.426-.368.91-.663%201.431-.875a10.073%2010.073%200%200%200%201.802-.898%208.182%208.182%200%200%201%201.717-.728c.536-.138%201.08-.247%201.627-.327a11.733%2011.733%200%200%200%201.543-.36c.449-.142%201.056-.38%201.87-.706a41.625%2041.625%200%200%201%201.622-.628.444.444%200%200%200%20.259-.227.448.448%200%200%200%200-.37.428.428%200%200%200-.228-.253l.016.026zm2.589-.992a11.63%2011.63%200%200%200-2.023.676.486.486%200%200%200-.243.237.575.575%200%200%200%200%20.354.528.528%200%200%200%20.258.258c.108.048.23.048.339%200a10.948%2010.948%200%200%201%201.88-.654%2036.201%2036.201%200%200%200%201.654-.338c.569-.102%201.144-.16%201.722-.174a6.15%206.15%200%200%200%201.907-.296%205.896%205.896%200%200%201%201.69-.306%2020.276%2020.276%200%200%201%201.913-.047c.488-.008.971.091%201.416.29a3.347%203.347%200%200%200%202.029.259%204.76%204.76%200%200%201%201.701.031c.617.11%201.24.184%201.865.222a.428.428%200%200%200%20.322-.095.47.47%200%200%200%20.159-.338.433.433%200%200%200-.117-.338.418.418%200%200%200-.3-.142%2015.5%2015.5%200%200%201-1.755-.211%205.87%205.87%200%200%200-2.028-.032c-.505.09-1.025.03-1.495-.174a4.082%204.082%200%200%200-1.776-.422c-.664-.014-1.329.007-1.991.063a6.599%206.599%200%200%200-1.95.37%205.658%205.658%200%200%201-1.653.274c-.626.013-1.25.077-1.865.19-.528.11-1.057.216-1.643.322l-.016.021zM6.138%202.124c.217-.353.528-.828.914-1.43a.359.359%200%200%200%20.069-.317.385.385%200%200%200-.196-.29.423.423%200%200%200-.338-.08.528.528%200%200%200-.29.19A48.355%2048.355%200%200%200%205.35%201.66v.058c-.252.48-.463.982-.629%201.499A4.326%204.326%200%200%201%203.903%204.8a7.292%207.292%200%200%200-1.056%201.816%204.712%204.712%200%200%201-.856%201.462%2010.465%2010.465%200%200%200-1.11%201.715c-.224.436-.473.859-.744%201.267v.031a1.661%201.661%200%200%200%200%201.32v.063c.037.113.112.21.211.274.05.025.103.043.158.053.548.127%201.08.315%201.585.56.529.264%201.057.501%201.48.707a26.46%2026.46%200%200%200%201.653.723%208.84%208.84%200%200%200%201.85.496%205.45%205.45%200%200%201%201.669.68c.602.344%201.237.625%201.896.84.378.098.749.221%201.11.37.285.1.676.253%201.178.464a.45.45%200%200%200%20.333%200%20.407.407%200%200%200%20.259-.259.464.464%200%200%200-.26-.575c-.496-.211-.887-.37-1.172-.47-.394-.156-.796-.29-1.205-.4a8.748%208.748%200%200%201-1.706-.74%205.968%205.968%200%200%200-1.96-.812%208.216%208.216%200%200%201-1.659-.465%2024.368%2024.368%200%200%201-1.585-.691c-.444-.2-.93-.428-1.469-.692a8.072%208.072%200%200%200-.781-.322.047.047%200%200%200%200-.047.39.39%200%200%200%20.047-.338.433.433%200%200%200-.227-.29.455.455%200%200%200-.338-.048.57.57%200%200%200-.285.227l-.032.032a1.186%201.186%200%200%201%200-.211c.164-.238.407-.681.74-1.314a9.198%209.198%200%200%201%20.993-1.547%205.499%205.499%200%200%200%201.056-1.715c.234-.567.543-1.1.92-1.583a5.139%205.139%200%200%200%20.977-1.88c.138-.474.315-.936.528-1.382l.037.005z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cfilter%20id%3D%22a%22%20width%3D%22110.9%25%22%20height%3D%22132.6%25%22%20x%3D%22-5.4%25%22%20y%3D%22-16.3%25%22%20filterUnits%3D%22objectBoundingBox%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeOffset%20in%3D%22SourceAlpha%22%20result%3D%22shadowOffsetOuter1%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeGaussianBlur%20in%3D%22shadowOffsetOuter1%22%20result%3D%22shadowBlurOuter1%22%20stdDeviation%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeColorMatrix%20in%3D%22shadowBlurOuter1%22%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.65%200%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Ffilter%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22nonzero%22%20transform%3D%22translate%282%202%29%22%3E%0A%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23000%22%20filter%3D%22url%28%23a%29%22%20xlink%3Ahref%3D%22%23b%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23FFF%22%20xlink%3Ahref%3D%22%23b%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
	"ui_game_roll_small_arrow.svg": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2216%22%20height%3D%2215%22%20viewBox%3D%220%200%2016%2015%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20id%3D%22b%22%20d%3D%22M48.088%201.977c-.1%200-.2%200-.3.1-.1-.1-.1%200-.2.1h-.1v.1c-.1.5-.3.9-.8%201.1-.8.5-1.5%201.2-1.7%202.1-.1.6-.5%201.2-1%201.6-.7.7-1.1%201.1-1%201.3v.1c-.1%200-.2.1-.4.4v.4c0%20.1.1.2.2.3.1.1.3.1.4.1.1%200%20.3-.1.4-.2.3-.4.5-.8.5-1.2.1%200%20.3-.1.6-.4.6-.6%201.1-1.3%201.3-2.1.2-.7.6-1.2%201.2-1.5.3-.1.6-.4.8-.6%200%20.1%200%20.2-.1.4-.2.8-.2%201.5.1%202.3.2.7.2%201.4.1%202.2-.1.7%200%201.3.3%202%20.2.5.3%201.1.2%201.7%200%20.7-.1%201.4-.2%202.1-.1.7-.1%201.5%200%202.2%200%20.1.1.2.2.3.1.1.2.1.4.1.1%200%20.2-.1.3-.2.1-.1.1-.2.1-.4-.1-.6-.1-1.2%200-1.8%200-.8.1-1.5.2-2.2.1-.7%200-1.5-.3-2.2-.2-.4-.3-.9-.1-1.4.1-.9.1-1.7-.1-2.6-.3-.6-.3-1.2-.2-1.8.1-.1.1-.3.1-.5.1.2.3.4.4.6.5.7%201.1%201.3%201.8%201.6.4.3.9.7%201.2%201.1.4.5.9.9%201.4%201.3.1.1.2.1.4.1s.3-.1.4-.2v-.4c0-.1-.1-.2-.2-.3-.5-.4-.9-.7-1.3-1.2s-.9-1-1.6-1.3c-.5-.3-1-.8-1.4-1.3-.4-.6-.9-1.1-1.4-1.4h-.2c.1-.1.1-.2%200-.3-.1%200-.1-.1-.2-.2h-.2z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cfilter%20id%3D%22a%22%20width%3D%22150%25%22%20height%3D%22140%25%22%20x%3D%22-25%25%22%20y%3D%22-20%25%22%20filterUnits%3D%22objectBoundingBox%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeOffset%20in%3D%22SourceAlpha%22%20result%3D%22shadowOffsetOuter1%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeGaussianBlur%20in%3D%22shadowOffsetOuter1%22%20result%3D%22shadowBlurOuter1%22%20stdDeviation%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeColorMatrix%20in%3D%22shadowBlurOuter1%22%20values%3D%220%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.65%200%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Ffilter%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22nonzero%22%20transform%3D%22rotate%2848%2030.834%20-36.443%29%22%3E%0A%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23000%22%20filter%3D%22url%28%23a%29%22%20xlink%3Ahref%3D%22%23b%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23FFF%22%20xlink%3Ahref%3D%22%23b%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
	"ui_btn_kiss.svg": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewBox%3D%220%200%20100%2060%22%20width%3D%22100px%22%20height%3D%2260px%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bisolation%3Aisolate%3B%7D.cls-2%7Bopacity%3A0.8%3Bmix-blend-mode%3Amultiply%3B%7D.cls-3%7Bfill%3A%239bcc33%3B%7D.cls-4%7Bopacity%3A0.1%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3EAsset%204%3C%2Ftitle%3E%3Cg%20class%3D%22cls-1%22%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cg%20id%3D%22Layer_2-2%22%20data-name%3D%22Layer%202%22%3E%3Cimage%20class%3D%22cls-2%22%20width%3D%22100%22%20height%3D%2260%22%20xlink%3Ahref%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAYAAACQPx%2FOAAAACXBIWXMAAAsSAAALEgHS3X78AAAFcklEQVR4Xu2cfW7bOBDFnxMnTuoUm96iJ%2BlheqAepifpLbaLNE6cD6t%2FkM98Gg0pWfECtsQBBjRomY7npzekFI4WTdOg2unYsu%2BAQ%2Bzn96%2BLvmOmaN9%2B%2FDraWb0Yq5Ce4M8FTDZ4YyEdBMRAyL0u9U3JvMBp3%2F71IXAGAREQXpt7by7WOK3XNwhMLxADQ%2F3C6ZsbFAtBfef09UIpAokwPAgXjrMfmD4YqwAGf%2Bd4B04JShaIgaGBv8y4gpkTEAXxnnELKAvFBZKBcYmwTF4CuDKtBTNlKB4MDf4bgFfTvqENJgulA0TmDFWFgriOvortFRKYJXylTM2sMhj01%2BgvALaxfUEbjKqlM6fkLgxVHVQGIdw4TjBUC6FwrCmZzhtUB2G8AHiOfhVbnpz62Sb2lRViUhVTEFVxA%2BAWwKfo69jeIoBaxWP5OR1rStaIM029IihiC%2BAJwAbAY2w3se8ZSS38XCd19SlE1XGDAOAOwOfo6%2BiEco22SqY2j%2BgZrupginpCALFCSt96vLqrEA%2BITVeqkE8IIP6J%2FhkB0Brt1OUp5Nyh2MmcCtFU9YgUB8JQcHbl1YGyT1kmXXGCXiGc%2FVTFPYAv0e%2BjUylUyRyBqDoeAPyO%2Fm%2F037H%2FTzxuizTJt9LWGIWskeDcIyjlDl0gc0lZCmSF8NsR32Mqe47tVezTVWjvKssC4XKXk%2FoaSTGaukpAOO45mwbOA2JhEMQTQuw26M6vnZhYIHpG61U5VcIUxsmcYO4Q1EMgei2i4567WYXsEIBcowtDJ3idW73sUVxlae63KuHylmqhcynM1YXOIcA0gXAOYaCBBOMWIUZ6OeCpw1eI888mwvBumeiVunVd9tovPHcoNmURCFdTnDM0FnrBbC%2BaW%2FH4%2Bf3r4tuPX01OIfpawaharCu0udw60aVtLiaapnrnVQViD7SpS6FYv4D%2FxVMHAvgx8OJjU5WNt7vs9QKoULRVUN6X8eyZoi2QLuxKsfBi5o1VnNT1wIW81r4hrp%2BbmjXo%2F%2F25WOTAABh2FnsDFQetlo1Vb8yGALGmg1ZAwXJBPzgmY4AAR%2FwDJmBHPUHHAqn2P1kFcmJWgZyYVSAnZhXIiVkFcmJWgZyYjQWiN9fsbem5mff7NT4H2RggR%2F0DJmJHO0GHAPGCPncAfZaLVW%2FMSnd7vYGaA3whn5ui9f1%2BdZg2GxcLxDuQA3i1Dp1t9ua9UfdzzsC8oHux8GLmjbU3BdIgBTD3ZaX6B75mGhx9g%2B0MTOPixcCLj3fS6ngA%2FJRlD7QwdNu9Ov%2BXDsxrk4MtRVDX7aMKRcdp2RIINQpm54kFoV%2FKmoetuO5L2mFe24De0I4F3asNyYFBaSupTVWqCn4Zd%2BR52yfnuFFui1R2QOf20S3aarGpq2W5Sd3mR60K4o48bh1VGC%2BY71bSJ6QN1Y%2FRubHa1oWoQlpQSgqx6qAquOXe28s6983WfwD8hzYYqiWnkpYNAaL1DxukXXkWRi1HaJcjPCBVUdnqqSwQr6SN%2BX%2BJdimb3fFeC3a6J%2BwjgjIeEJRC19oQwtkXgPaVtHkKuUQYiKkI8X39Q2pJW1IJlfKAAxWSu3WiZwC%2FUAO8Q1rucaVViz5TPGzRp6riHRkYALJ16kxdDK7Wh9Sy6GD2Ok1Tl%2FXsSmtonbqmLSAFlX16XbJBe%2Fe73d86RdP4MB5DHhxQTFeAoxCgPlqjx%2BzkrtdrqhZtvav0YY%2FWoNWHzxTNg2LBqO8wAAZQAALUxzMVrDEtA71zvJG2CAPoAQLUB5j1mFWK%2Bs7p%2B9gDzGj1EX9Fs2pp4Pf1wgAGAqHVh2C2zAuc9u1fDwFBOwiIWn1MLAAfCoDDIKiNBuJZfZDyx%2B2oQKp93P4Cd7aD9oak7gAAAAAASUVORK5CYII%3D%22%2F%3E%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_1%22%20data-name%3D%22%D0%A1%D0%BB%D0%BE%D0%B9%201%22%3E%3Crect%20class%3D%22cls-3%22%20x%3D%2212%22%20y%3D%2210%22%20width%3D%2276%22%20height%3D%2236%22%20rx%3D%228%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cpath%20class%3D%22cls-4%22%20d%3D%22M80%2C9H20a9%2C9%2C0%2C0%2C0-9%2C9V38a9%2C9%2C0%2C0%2C0%2C9%2C9H80a9%2C9%2C0%2C0%2C0%2C9-9V18A9%2C9%2C0%2C0%2C0%2C80%2C9Zm8%2C29a8%2C8%2C0%2C0%2C1-8%2C8H20a8%2C8%2C0%2C0%2C1-8-8V18a8%2C8%2C0%2C0%2C1%2C8-8H80a8%2C8%2C0%2C0%2C1%2C8%2C8Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
	"ui_btn_refuse.svg": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewBox%3D%220%200%20100%2060%22%20width%3D%22100px%22%20height%3D%2260px%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bisolation%3Aisolate%3B%7D.cls-2%7Bopacity%3A0.8%3Bmix-blend-mode%3Amultiply%3B%7D.cls-3%7Bfill%3A%23e03d1f%3B%7D.cls-4%7Bopacity%3A0.1%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3EAsset%203%3C%2Ftitle%3E%3Cg%20class%3D%22cls-1%22%3E%3Cg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%3E%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%3Cg%20id%3D%22Layer_2-2%22%20data-name%3D%22Layer%202%22%3E%3Cimage%20class%3D%22cls-2%22%20width%3D%22100%22%20height%3D%2260%22%20xlink%3Ahref%3D%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAYAAACQPx%2FOAAAACXBIWXMAAAsSAAALEgHS3X78AAAFcklEQVR4Xu2cfW7bOBDFnxMnTuoUm96iJ%2BlheqAepifpLbaLNE6cD6t%2FkM98Gg0pWfECtsQBBjRomY7npzekFI4WTdOg2unYsu%2BAQ%2Bzn96%2BLvmOmaN9%2B%2FDraWb0Yq5Ce4M8FTDZ4YyEdBMRAyL0u9U3JvMBp3%2F71IXAGAREQXpt7by7WOK3XNwhMLxADQ%2F3C6ZsbFAtBfef09UIpAokwPAgXjrMfmD4YqwAGf%2Bd4B04JShaIgaGBv8y4gpkTEAXxnnELKAvFBZKBcYmwTF4CuDKtBTNlKB4MDf4bgFfTvqENJgulA0TmDFWFgriOvortFRKYJXylTM2sMhj01%2BgvALaxfUEbjKqlM6fkLgxVHVQGIdw4TjBUC6FwrCmZzhtUB2G8AHiOfhVbnpz62Sb2lRViUhVTEFVxA%2BAWwKfo69jeIoBaxWP5OR1rStaIM029IihiC%2BAJwAbAY2w3se8ZSS38XCd19SlE1XGDAOAOwOfo6%2BiEco22SqY2j%2BgZrupginpCALFCSt96vLqrEA%2BITVeqkE8IIP6J%2FhkB0Brt1OUp5Nyh2MmcCtFU9YgUB8JQcHbl1YGyT1kmXXGCXiGc%2FVTFPYAv0e%2BjUylUyRyBqDoeAPyO%2Fm%2F037H%2FTzxuizTJt9LWGIWskeDcIyjlDl0gc0lZCmSF8NsR32Mqe47tVezTVWjvKssC4XKXk%2FoaSTGaukpAOO45mwbOA2JhEMQTQuw26M6vnZhYIHpG61U5VcIUxsmcYO4Q1EMgei2i4567WYXsEIBcowtDJ3idW73sUVxlae63KuHylmqhcynM1YXOIcA0gXAOYaCBBOMWIUZ6OeCpw1eI888mwvBumeiVunVd9tovPHcoNmURCFdTnDM0FnrBbC%2BaW%2FH4%2Bf3r4tuPX01OIfpawaharCu0udw60aVtLiaapnrnVQViD7SpS6FYv4D%2FxVMHAvgx8OJjU5WNt7vs9QKoULRVUN6X8eyZoi2QLuxKsfBi5o1VnNT1wIW81r4hrp%2BbmjXo%2F%2F25WOTAABh2FnsDFQetlo1Vb8yGALGmg1ZAwXJBPzgmY4AAR%2FwDJmBHPUHHAqn2P1kFcmJWgZyYVSAnZhXIiVkFcmJWgZyYjQWiN9fsbem5mff7NT4H2RggR%2F0DJmJHO0GHAPGCPncAfZaLVW%2FMSnd7vYGaA3whn5ui9f1%2BdZg2GxcLxDuQA3i1Dp1t9ua9UfdzzsC8oHux8GLmjbU3BdIgBTD3ZaX6B75mGhx9g%2B0MTOPixcCLj3fS6ngA%2FJRlD7QwdNu9Ov%2BXDsxrk4MtRVDX7aMKRcdp2RIINQpm54kFoV%2FKmoetuO5L2mFe24De0I4F3asNyYFBaSupTVWqCn4Zd%2BR52yfnuFFui1R2QOf20S3aarGpq2W5Sd3mR60K4o48bh1VGC%2BY71bSJ6QN1Y%2FRubHa1oWoQlpQSgqx6qAquOXe28s6983WfwD8hzYYqiWnkpYNAaL1DxukXXkWRi1HaJcjPCBVUdnqqSwQr6SN%2BX%2BJdimb3fFeC3a6J%2BwjgjIeEJRC19oQwtkXgPaVtHkKuUQYiKkI8X39Q2pJW1IJlfKAAxWSu3WiZwC%2FUAO8Q1rucaVViz5TPGzRp6riHRkYALJ16kxdDK7Wh9Sy6GD2Ok1Tl%2FXsSmtonbqmLSAFlX16XbJBe%2Fe73d86RdP4MB5DHhxQTFeAoxCgPlqjx%2BzkrtdrqhZtvav0YY%2FWoNWHzxTNg2LBqO8wAAZQAALUxzMVrDEtA71zvJG2CAPoAQLUB5j1mFWK%2Bs7p%2B9gDzGj1EX9Fs2pp4Pf1wgAGAqHVh2C2zAuc9u1fDwFBOwiIWn1MLAAfCoDDIKiNBuJZfZDyx%2B2oQKp93P4Cd7aD9oak7gAAAAAASUVORK5CYII%3D%22%2F%3E%3Cg%20id%3D%22%D0%A1%D0%BB%D0%BE%D0%B9_1%22%20data-name%3D%22%D0%A1%D0%BB%D0%BE%D0%B9%201%22%3E%3Crect%20class%3D%22cls-3%22%20x%3D%2212%22%20y%3D%2210%22%20width%3D%2276%22%20height%3D%2236%22%20rx%3D%228%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cpath%20class%3D%22cls-4%22%20d%3D%22M80%2C9H20a9%2C9%2C0%2C0%2C0-9%2C9V38a9%2C9%2C0%2C0%2C0%2C9%2C9H80a9%2C9%2C0%2C0%2C0%2C9-9V18A9%2C9%2C0%2C0%2C0%2C80%2C9Zm8%2C29a8%2C8%2C0%2C0%2C1-8%2C8H20a8%2C8%2C0%2C0%2C1-8-8V18a8%2C8%2C0%2C0%2C1%2C8-8H80a8%2C8%2C0%2C0%2C1%2C8%2C8Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
};
function BottleIcon({ src, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		...props,
		src,
		onError: (event) => {
			const image = event.currentTarget;
			const fallback = bottleIconFallbacks[src?.split("/").at(-1) ?? ""];
			if (fallback && image.src !== fallback) image.src = fallback;
		}
	});
}
function preloadBottleIcon(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve();
		image.onerror = () => {
			const fallback = bottleIconFallbacks[url.split("/").at(-1) ?? ""];
			if (fallback && image.src !== fallback) image.src = fallback;
			else reject(/* @__PURE__ */ new Error(`Bottle icon unavailable: ${url}`));
		};
		image.src = url;
	});
}
var kissUp = { url: bottleIconFallbacks["ui_arrow_kiss_up.svg"] };
var kissDown = { url: bottleIconFallbacks["ui_arrow_kiss_down.svg"] };
var refuseUp = { url: bottleIconFallbacks["ui_arrow_refuse_up.svg"] };
var refuseDown = { url: bottleIconFallbacks["ui_arrow_refuse_down.svg"] };
var kissButton = { url: bottleIconFallbacks["ui_btn_kiss.svg"] };
var refuseButton = { url: bottleIconFallbacks["ui_btn_refuse.svg"] };
var rollBig = { url: bottleIconFallbacks["ui_game_roll_big_arrow.svg"] };
var rollSmall = { url: bottleIconFallbacks["ui_game_roll_small_arrow.svg"] };
var VIEWER = 5;
var offers = [
	[
		35,
		-94,
		-45,
		13,
		-82
	],
	[
		74,
		-83,
		0,
		30,
		-74
	],
	[
		83,
		-43,
		45,
		27,
		-48
	],
	[
		83,
		38,
		45,
		27,
		32
	],
	[
		74,
		78,
		90,
		30,
		54
	],
	[
		35,
		91,
		135,
		13,
		67
	],
	[
		-47,
		91,
		135,
		-69,
		67
	],
	[
		-89,
		78,
		180,
		-90,
		54
	],
	[
		-99,
		38,
		-135,
		-86,
		32
	],
	[
		-99,
		-43,
		-135,
		-86,
		-48
	],
	[
		-89,
		-83,
		-90,
		-90,
		-74
	],
	[
		-47,
		-94,
		-45,
		-69,
		-82
	]
];
/** Renders the server-owned round: every player at the table sees the same phase, spinner, target and choices. */
function BottlePlay({ table, assets }) {
	const selected = useBottle();
	const overlay = (0, import_react.useRef)(null);
	const live = useRoom();
	const srv = live.room;
	const waitKey = waitingHint(live.players);
	const canPlay = live.players.some((p) => p?.male === true) && live.players.some((p) => p?.male === false);
	(0, import_react.useEffect)(() => {
		table.resetRound(true);
		return () => table.resetRound();
	}, [table]);
	const round = srv ? {
		phase: srv.phase,
		spinner: srv.spinner === null ? -1 : toDisplay(srv.spinner, live.mySeat),
		target: srv.target === null ? -1 : toDisplay(srv.target, live.mySeat),
		decisions: Object.fromEntries(Object.entries(srv.decisions ?? {}).map(([seat, d]) => [toDisplay(Number(seat), live.mySeat), d]))
	} : {
		phase: "offer",
		spinner: -1,
		target: -1,
		decisions: {}
	};
	const spinnerHere = round.spinner >= 0 && Boolean(live.players[round.spinner]);
	const targetHere = round.target < 0 || Boolean(live.players[round.target]);
	const stale = srv !== null && srv.spinner !== null && (!spinnerHere || !targetHere);
	(0, import_react.useEffect)(() => {
		if (stale) nudgeRoom();
	}, [
		stale,
		srv?.spinner,
		srv?.target
	]);
	(0, import_react.useEffect)(() => {
		if (!canPlay || stale) table.resetRound();
	}, [
		canPlay,
		stale,
		table
	]);
	const [remaining, setRemaining] = (0, import_react.useState)(9);
	const [bottleError, setBottleError] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const animated = (0, import_react.useRef)({
		spun: -1,
		returned: -1,
		kissed: -1,
		from: -1,
		to: -1
	});
	(0, import_react.useEffect)(() => {
		Promise.all([
			kissUp,
			kissDown,
			refuseUp,
			refuseDown,
			kissButton,
			refuseButton,
			rollBig,
			rollSmall
		].map((asset) => preloadBottleIcon(asset.url))).then(() => completeLoadingStage("icons"), failGameLoading);
	}, []);
	(0, import_react.useEffect)(() => {
		preloadSfx(assets.sfxUrl, "ding");
		const unlock = () => unlockSfx();
		window.addEventListener("pointerdown", unlock, { once: true });
		window.addEventListener("keydown", unlock, { once: true });
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
		};
	}, [assets.sfxUrl]);
	(0, import_react.useEffect)(() => {
		const sound = turnOfferSound(round.phase, round.spinner, VIEWER, ready && canPlay && !stale);
		if (sound) playSfx(assets.sfxUrl, sound);
	}, [
		round.phase,
		round.spinner,
		ready,
		canPlay,
		stale,
		assets.sfxUrl
	]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		setReady(false);
		setBottleError(false);
		table.setBottle(selected).then(() => {
			if (alive) {
				setReady(true);
				completeLoadingStage("bottle");
			}
		}, () => {
			if (alive) {
				setBottleError(true);
				failGameLoading();
			}
		});
		return () => {
			alive = false;
		};
	}, [selected, table]);
	(0, import_react.useEffect)(() => {
		const el = overlay.current;
		const host = el?.parentElement;
		if (!el || !host) return;
		const layout = () => {
			const header = host.parentElement?.querySelector(".original-table-header")?.getBoundingClientRect().height ?? 0;
			const scale = Math.min(host.clientWidth / 375, (host.clientHeight - header) / 375);
			el.style.transform = `translate(${host.clientWidth / 2}px,${header + (host.clientHeight - header) / 2}px) scale(${scale})`;
		};
		layout();
		const ro = new ResizeObserver(layout);
		ro.observe(host);
		return () => ro.disconnect();
	}, []);
	const roundNo = srv?.round ?? 0;
	const placed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (placed.current || !srv || !ready || !canPlay || stale) return;
		placed.current = true;
		if (round.phase !== "offer" && round.phase !== "spin" && round.target >= 0) {
			table.settleRound(round.spinner, round.target, round.phase === "choose" || round.phase === "result");
			animated.current.spun = roundNo;
			animated.current.returned = round.phase === "return" ? roundNo : -1;
			animated.current.from = round.spinner;
			animated.current.to = round.target;
		}
	}, [
		Boolean(srv),
		ready,
		canPlay,
		stale,
		table
	]);
	(0, import_react.useEffect)(() => {
		if (!ready || !canPlay || stale) return;
		if (round.phase === "spin" && animated.current.spun !== roundNo && round.spinner >= 0 && round.target >= 0 && live.players[round.target]) {
			animated.current.spun = roundNo;
			animated.current.from = round.spinner;
			animated.current.to = round.target;
			unlockSfx();
			table.spinBottle(round.spinner, round.target, roundNo * .6180339887 % 1);
		}
		if (round.phase === "result" && animated.current.kissed !== roundNo && round.decisions[round.spinner] === "kiss" && round.decisions[round.target] === "kiss") {
			animated.current.kissed = roundNo;
			table.addKiss(round.spinner);
			table.addKiss(round.target);
		}
		if ((round.phase === "return" || round.phase === "offer") && animated.current.spun === roundNo && animated.current.returned !== roundNo) {
			animated.current.returned = roundNo;
			table.returnPlayers(animated.current.from, animated.current.to);
		}
	}, [
		round.phase,
		roundNo,
		table,
		ready,
		canPlay,
		stale,
		Boolean(live.players[round.target])
	]);
	(0, import_react.useEffect)(() => {
		if (round.phase !== "choose") return;
		const startedAt = srv ? Date.parse(srv.phase_at) : live.phaseReceivedAt;
		const tick = () => setRemaining(Math.max(0, Math.min(9, 9 - Math.floor((serverNow() - startedAt) / 1e3))));
		tick();
		const interval = window.setInterval(tick, 250);
		return () => window.clearInterval(interval);
	}, [
		round.phase,
		live.phaseReceivedAt,
		srv?.phase_at
	]);
	const spin = () => {
		if (round.phase !== "offer" || round.spinner !== VIEWER || !ready || !canPlay || stale) return;
		unlockSfx();
		spinBottle();
	};
	const participating = round.spinner === VIEWER || round.target === VIEWER;
	const [willTheyKiss, setWillTheyKiss] = (0, import_react.useState)(false);
	const decidedCount = Object.keys(round.decisions).length;
	(0, import_react.useEffect)(() => {
		setWillTheyKiss(false);
		if (round.phase !== "choose" || participating) return;
		const id = window.setTimeout(() => setWillTheyKiss(true), 5e3);
		return () => window.clearTimeout(id);
	}, [
		round.phase,
		roundNo,
		participating
	]);
	const kissHint = !participating && canPlay && !stale && round.phase === "choose" ? decidedCount >= 1 ? "Qarşılıq verəcək?" : willTheyKiss ? "Öpüşəcəklər?" : null : null;
	const [left, right] = round.spinner >= 0 && round.target >= 0 ? leftRight(round.spinner, round.target) : [-1, -1];
	const offer = offers[round.spinner] ?? offers[0];
	const decide$1 = (decision) => {
		if (round.phase !== "choose" || !participating || round.decisions[VIEWER]) return;
		decide(decision === "kiss");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: overlay,
		className: "bottle-play-overlay",
		"aria-label": "Şüşə oyunu",
		"data-phase": round.phase,
		"data-spinner": round.spinner,
		"data-target": round.target,
		children: [
			waitKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bottle-turn-status bottle-turn-status--waiting",
				role: "status",
				children: translate(assets, waitKey)
			}),
			kissHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bottle-kiss-hint",
				role: "status",
				children: kissHint
			}),
			canPlay && !stale && round.phase === "offer" && round.spinner < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bottle-turn-status bottle-turn-status--waiting",
				role: "status",
				children: translate(assets, "game:nextturn")
			}),
			canPlay && !stale && round.phase === "offer" && round.spinner === VIEWER && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "bottle-spin-hit",
					"aria-label": "Şüşəni fırlat",
					disabled: !ready,
					onClick: spin
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleIcon, {
					className: "bottle-roll-big",
					src: rollBig.url,
					alt: ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bottle-roll-text",
					children: translate(assets, "game:spin")
				})
			] }),
			canPlay && !stale && round.phase === "offer" && round.spinner !== VIEWER && spinnerHere && offer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleIcon, {
				className: "bottle-roll-small",
				src: rollSmall.url,
				alt: "",
				style: {
					left: offer[0],
					top: offer[1],
					transform: `translate(-50%,-50%) rotate(${offer[2]}deg)`
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bottle-small-text",
				style: {
					left: offer[3],
					top: offer[4]
				},
				children: translate(assets, "game:spins")
			})] }),
			canPlay && !stale && decisionArrowsVisible(round.phase) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				round.decisions[left] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleIcon, {
					className: "bottle-decision-arrow bottle-arrow-up",
					src: round.decisions[left] === "kiss" ? kissUp.url : refuseUp.url,
					alt: round.decisions[left] === "kiss" ? "Öpdü" : "İmtina etdi"
				}),
				round.decisions[right] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleIcon, {
					className: "bottle-decision-arrow bottle-arrow-down",
					src: round.decisions[right] === "kiss" ? kissDown.url : refuseDown.url,
					alt: round.decisions[right] === "kiss" ? "Öpdü" : "İmtina etdi"
				}),
				decisionTimerVisible(round.phase, participating, Boolean(round.decisions[VIEWER])) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bottle-countdown",
					role: "timer",
					"aria-label": "Seçim müddəti",
					children: remaining
				}),
				round.phase === "choose" && participating && !round.decisions[VIEWER] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "bottle-decision-button bottle-refuse-button",
					onClick: () => decide$1("refuse"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleIcon, {
						src: refuseButton.url,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: translate(assets, "game:choose:btn_kiss_cancel") })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "bottle-decision-button bottle-kiss-button",
					onClick: () => decide$1("kiss"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottleIcon, {
						src: kissButton.url,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: translate(assets, "game:choose:btn_kiss") })]
				})] })
			] }),
			bottleError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "bottle-retry",
				onClick: () => {
					setBottleError(false);
					table.setBottle(selected).then(() => setReady(true), () => setBottleError(true));
				},
				children: "Şüşəni yenidən yüklə"
			})
		]
	});
}
var MAX = 3;
var box = null;
function chatRect() {
	const list = document.querySelectorAll(".original-chat, .chat");
	for (const el of Array.from(list)) {
		const r = el.getBoundingClientRect();
		if (r.width > 60 && r.height > 60 && r.bottom > 0 && r.top < window.innerHeight) return r;
	}
	return null;
}
function place() {
	if (!box) return;
	const r = chatRect();
	const left = r ? r.left : 0, width = r ? r.width : window.innerWidth;
	const top = r ? Math.max(0, r.top) : Math.round(.62 * window.innerHeight);
	box.style.left = `${Math.round(left + width / 2)}px`;
	box.style.top = `${Math.round(top + 8)}px`;
	box.style.width = `${Math.max(140, Math.round(width - 16))}px`;
}
if (typeof window !== "undefined") window.addEventListener("resize", place);
function addNotice(el, ms) {
	if (!getChatPreferences().premium) return;
	if (!box || !box.isConnected) {
		box = document.createElement("div");
		box.className = "gift-notices";
		document.body.appendChild(box);
	}
	place();
	box.appendChild(el);
	while (box.children.length > MAX) box.firstChild?.remove();
	window.setTimeout(() => {
		el.classList.add("gift-notice-out");
		window.setTimeout(() => el.remove(), 280);
	}, ms);
}
function premiumToast(text) {
	const el = document.createElement("div");
	el.className = "table-bg-toast";
	el.textContent = text;
	addNotice(el, 3200);
}
var queue = [];
var showing = false;
function premiumAnnounce(title, text) {
	if (!getChatPreferences().premium) return;
	queue.push({
		title,
		text
	});
	while (queue.length > 3) queue.shift();
	if (!showing) next();
}
function next() {
	const item = queue.shift();
	if (!item) {
		showing = false;
		return;
	}
	showing = true;
	const el = document.createElement("div");
	el.className = "premium-announce";
	const t = document.createElement("div");
	t.className = "premium-announce__title";
	t.textContent = item.title;
	const x = document.createElement("div");
	x.className = "premium-announce__text";
	x.textContent = item.text;
	el.append(t, x);
	addNotice(el, 4500);
	window.setTimeout(next, 4500);
}
/** Dd.show: big "+N" pop for the receiver. */
function datRewardPop(n) {
	if (!getChatPreferences().premium) return;
	const el = document.createElement("div");
	el.className = "crystal-fx";
	el.textContent = `+${n} DAT`;
	document.body.appendChild(el);
	window.setTimeout(() => el.remove(), 2600);
}
var VERT = "attribute vec2 p;varying vec2 uv;void main(){uv=vec2((p.x+1.0)*.5,1.0-(p.y+1.0)*.5);gl_Position=vec4(p,0,1);}";
var FRAG = "precision mediump float;varying vec2 uv;uniform sampler2D tex;void main(){vec4 rgb=texture2D(tex,vec2(uv.x*.5,uv.y));float a=texture2D(tex,vec2(.5+uv.x*.5,uv.y)).r;gl_FragColor=vec4(rgb.rgb,a);}";
var fx = {
	queue: [],
	playing: false,
	playingSince: 0,
	lost: false,
	el: null,
	canvas: null,
	video: null,
	gl: null,
	tex: null,
	frameReq: 0,
	playback: 0,
	finish: null,
	cancelFrame() {
		if (!this.frameReq) return;
		if (this.video?.cancelVideoFrameCallback) this.video.cancelVideoFrameCallback(this.frameReq);
		else cancelAnimationFrame(this.frameReq);
		this.frameReq = 0;
	},
	play(item) {
		this.queue.push(item);
		while (this.queue.length > 3) this.queue.shift();
		if (this.playing && Date.now() - this.playingSince > 25e3) this.finish?.();
		if (!this.playing) this.run();
	},
	run() {
		this.playing = true;
		this.playingSince = Date.now();
		Promise.resolve().then(() => this.next()).catch(() => {
			this.playing = false;
			if (this.queue.length) window.setTimeout(() => this.run(), 300);
		});
	},
	reset() {
		this.playback++;
		this.cancelFrame();
		try {
			if (this.video) {
				this.video.pause();
				this.video.removeAttribute("src");
				this.video.load();
			}
		} catch {}
		this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
		this.el?.remove();
		this.el = null;
		this.canvas = null;
		this.video = null;
		this.gl = null;
		this.tex = null;
		this.lost = false;
	},
	fallback(item) {
		domEffect(item.icon);
	},
	ensure() {
		if (this.el && this.gl && this.gl.isContextLost?.()) this.reset();
		if (this.el) return true;
		const el = document.createElement("div");
		el.className = "live-gift-fx";
		const canvas = document.createElement("canvas");
		canvas.width = 360;
		canvas.height = 640;
		canvas.className = "live-gift-fx__canvas";
		const video = document.createElement("video");
		video.playsInline = true;
		video.setAttribute("playsinline", "");
		video.preload = "auto";
		video.className = "live-gift-fx__video";
		el.append(canvas, video);
		const gl = canvas.getContext("webgl", {
			alpha: true,
			premultipliedAlpha: false,
			antialias: false,
			powerPreference: "low-power"
		});
		if (!gl) return false;
		const sh = (type, src) => {
			const s = gl.createShader(type);
			if (!s) return null;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			return s;
		};
		const prog = gl.createProgram();
		const vert = sh(gl.VERTEX_SHADER, VERT), frag = sh(gl.FRAGMENT_SHADER, FRAG);
		if (!prog || !vert || !frag) return false;
		gl.attachShader(prog, vert);
		gl.attachShader(prog, frag);
		gl.linkProgram(prog);
		gl.deleteShader(vert);
		gl.deleteShader(frag);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
		gl.useProgram(prog);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			1,
			-1,
			-1,
			1,
			-1,
			1,
			1,
			-1,
			1,
			1
		]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(prog, "p");
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
		const tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		canvas.addEventListener("webglcontextlost", (e) => {
			e.preventDefault();
			this.lost = true;
		}, false);
		this.el = el;
		this.canvas = canvas;
		this.video = video;
		this.gl = gl;
		this.tex = tex;
		return true;
	},
	fit() {
		const el = this.el;
		if (!el) return;
		const vv = window.visualViewport;
		const w = Math.round(vv ? vv.width : window.innerWidth), h = Math.round(vv ? vv.height : window.innerHeight);
		let width = w, height = 16 * w / 9;
		if (height > 1.3 * h) {
			height = 1.3 * h;
			width = 9 * height / 16;
		}
		el.style.width = `${Math.round(width)}px`;
		el.style.height = `${Math.round(height)}px`;
		el.style.left = `${Math.round((w - width) / 2)}px`;
		el.style.top = `${Math.round(h - height)}px`;
		el.classList.toggle("live-gift-fx--boxed", width < w - 2);
	},
	draw(version) {
		if (version !== this.playback) return;
		const gl = this.gl, v = this.video, c = this.canvas;
		if (!gl || !v || !c || v.paused || v.ended) return;
		if (v.readyState >= 2) {
			gl.viewport(0, 0, c.width, c.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.bindTexture(gl.TEXTURE_2D, this.tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}
		const rvfc = v.requestVideoFrameCallback;
		this.frameReq = rvfc ? rvfc.call(v, () => this.draw(version)) : requestAnimationFrame(() => this.draw(version));
	},
	async next() {
		const item = this.queue.shift();
		if (!item) {
			this.playing = false;
			return;
		}
		this.playing = true;
		this.playingSince = Date.now();
		if (this.lost) this.reset();
		if (document.hidden || !this.ensure()) {
			if (!document.hidden) this.fallback(item);
			return this.next();
		}
		const v = this.video, el = this.el;
		if (!v || !el) {
			this.playing = false;
			return;
		}
		const version = ++this.playback;
		let finished = false;
		const done = () => {
			if (finished) return;
			finished = true;
			this.cancelFrame();
			this.playback++;
			this.finish = null;
			window.clearTimeout(guard);
			v.onended = v.onerror = null;
			v.pause();
			v.removeAttribute("src");
			v.load();
			if (this.gl) {
				this.gl.clearColor(0, 0, 0, 0);
				this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			}
			el.classList.remove("live-gift-fx--on");
			window.setTimeout(() => this.run(), 120);
		};
		const guard = window.setTimeout(done, 2e4);
		this.finish = done;
		if (!el.parentNode) document.body.appendChild(el);
		this.fit();
		v.onended = done;
		v.onerror = () => {
			this.fallback(item);
			done();
		};
		v.muted = false;
		v.src = item.video;
		el.classList.add("live-gift-fx--on");
		try {
			await v.play();
		} catch {
			if (finished || version !== this.playback) return;
			try {
				v.muted = true;
				await v.play();
			} catch {
				if (!finished && version === this.playback) {
					this.fallback(item);
					done();
				}
				return;
			}
		}
		if (!finished && version === this.playback) this.draw(version);
	}
};
if (typeof document !== "undefined") document.addEventListener("visibilitychange", () => {
	if (document.hidden && fx.video && !fx.video.paused) fx.video.dispatchEvent(new Event("ended"));
});
/** Zd.domEffect: glowing icon burst used when the video cannot play. */
function domEffect(src) {
	try {
		const previous = document.querySelectorAll(".premium-fx");
		if (previous.length >= 3) previous[0]?.remove();
		const el = document.createElement("div");
		el.className = "premium-fx";
		el.innerHTML = "<div class=\"premium-fx__ring\"></div><div class=\"premium-fx__rays\"></div><div class=\"premium-fx__sparks\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>";
		const img = document.createElement("img");
		img.className = "premium-fx__img";
		img.src = src;
		el.appendChild(img);
		document.body.appendChild(el);
		window.setTimeout(() => el.remove(), 2600);
	} catch {}
}
/** game_live_gift: everyone at the table sees and hears the clip (setting "premium" off hides it). */
function playLiveGiftVideo(item) {
	if (typeof window === "undefined" || !getChatPreferences().premium) return;
	fx.play(item);
}
/** Warm the browser cache so the first play starts at once. */
var warmed = /* @__PURE__ */ new Set();
function preloadLiveGiftVideo(url) {
	if (typeof window === "undefined" || warmed.has(url)) return;
	warmed.add(url);
	fetch(url, { cache: "force-cache" }).catch(() => warmed.delete(url));
}
var LIVE_PREMIUM_GIFTS = {
	live_6820: {
		"name": "Balina Dalışı",
		"effect_id": 8e3,
		"gift_id": 6820,
		"icon": "/room-assets/live-gifts/icons/6820.webp",
		"video": "/room-assets/live-gifts/8000.mp4",
		"dat": 215,
		"reward_dat": 107
	},
	live_9468: {
		"name": "Ritmik Ayı",
		"effect_id": 8869,
		"gift_id": 9468,
		"icon": "/room-assets/live-gifts/icons/9468.webp",
		"video": "/room-assets/live-gifts/8869.mp4",
		"dat": 300,
		"reward_dat": 150
	},
	live_9532: {
		"name": "Parlak Parla",
		"effect_id": 7790,
		"gift_id": 9532,
		"icon": "/room-assets/live-gifts/icons/9532.webp",
		"video": "/room-assets/live-gifts/7790.mp4",
		"dat": 409,
		"reward_dat": 204
	},
	live_6646: {
		"name": "Yavru Kedi Leon",
		"effect_id": 7568,
		"gift_id": 6646,
		"icon": "/room-assets/live-gifts/icons/6646.webp",
		"video": "/room-assets/live-gifts/7568.mp4",
		"dat": 489,
		"reward_dat": 244
	},
	live_59994: {
		"name": "Tezahürat Yapan Taraftarlar",
		"effect_id": 16122,
		"gift_id": 59994,
		"icon": "/room-assets/live-gifts/icons/59994.webp",
		"video": "/room-assets/live-gifts/16122.mp4",
		"dat": 500,
		"reward_dat": 250
	},
	live_547121: {
		"name": "Çöl Kurdu",
		"effect_id": 33405,
		"gift_id": 547121,
		"icon": "/room-assets/live-gifts/icons/547121.webp",
		"video": "/room-assets/live-gifts/33405.mp4",
		"dat": 500,
		"reward_dat": 250
	},
	live_10588: {
		"name": "Elmas Silah",
		"effect_id": 7148,
		"gift_id": 10588,
		"icon": "/room-assets/live-gifts/icons/10588.webp",
		"video": "/room-assets/live-gifts/7148.mp4",
		"dat": 500,
		"reward_dat": 250
	},
	live_14384: {
		"name": "Sage'in Serüveni",
		"effect_id": 13850,
		"gift_id": 14384,
		"icon": "/room-assets/live-gifts/icons/14384.webp",
		"video": "/room-assets/live-gifts/13850.mp4",
		"dat": 500,
		"reward_dat": 250
	},
	live_10517: {
		"name": "Çöl Kurdu",
		"effect_id": 7118,
		"gift_id": 10517,
		"icon": "/room-assets/live-gifts/icons/10517.webp",
		"video": "/room-assets/live-gifts/7118.mp4",
		"dat": 550,
		"reward_dat": 275
	},
	live_8469: {
		"name": "Kurt",
		"effect_id": 6433,
		"gift_id": 8469,
		"icon": "/room-assets/live-gifts/icons/8469.webp",
		"video": "/room-assets/live-gifts/6433.mp4",
		"dat": 550,
		"reward_dat": 275
	},
	live_105610: {
		"name": "Gol Tekrarı-ABD",
		"effect_id": 23478,
		"gift_id": 105610,
		"icon": "/room-assets/live-gifts/icons/105610.webp",
		"video": "/room-assets/live-gifts/23478.mp4",
		"dat": 600,
		"reward_dat": 300
	},
	live_54727: {
		"name": "Civciv İzdihamı",
		"effect_id": 22207,
		"gift_id": 54727,
		"icon": "/room-assets/live-gifts/icons/54727.webp",
		"video": "/room-assets/live-gifts/22207.mp4",
		"dat": 600,
		"reward_dat": 300
	},
	live_10669: {
		"name": "Gelecek Şehri",
		"effect_id": 7183,
		"gift_id": 10669,
		"icon": "/room-assets/live-gifts/icons/10669.webp",
		"video": "/room-assets/live-gifts/7183.mp4",
		"dat": 600,
		"reward_dat": 300
	},
	live_10672: {
		"name": "Yeni Şehirde Sam",
		"effect_id": 7181,
		"gift_id": 10672,
		"icon": "/room-assets/live-gifts/icons/10672.webp",
		"video": "/room-assets/live-gifts/7181.mp4",
		"dat": 600,
		"reward_dat": 300
	},
	live_11585: {
		"name": "Sıkı Çalış Daha Sıkı Eğlen",
		"effect_id": 10724,
		"gift_id": 11585,
		"icon": "/room-assets/live-gifts/icons/11585.webp",
		"video": "/room-assets/live-gifts/10724.mp4",
		"dat": 600,
		"reward_dat": 300
	},
	live_59884: {
		"name": "Yenilenmiş Zırh",
		"effect_id": 23528,
		"gift_id": 59884,
		"icon": "/room-assets/live-gifts/icons/59884.webp",
		"video": "/room-assets/live-gifts/23528.mp4",
		"dat": 600,
		"reward_dat": 300
	},
	live_9467: {
		"name": "Leopar Lili",
		"effect_id": 6795,
		"gift_id": 9467,
		"icon": "/room-assets/live-gifts/icons/9467.webp",
		"video": "/room-assets/live-gifts/6795.mp4",
		"dat": 660,
		"reward_dat": 330
	},
	live_8916: {
		"name": "Leon ve Lili",
		"effect_id": 6609,
		"gift_id": 8916,
		"icon": "/room-assets/live-gifts/icons/8916.webp",
		"video": "/room-assets/live-gifts/6609.mp4",
		"dat": 970,
		"reward_dat": 485
	},
	live_13469: {
		"name": "Henry",
		"effect_id": 8947,
		"gift_id": 13469,
		"icon": "/room-assets/live-gifts/icons/13469.webp",
		"video": "/room-assets/live-gifts/8947.mp4",
		"dat": 1e3,
		"reward_dat": 500
	},
	live_12922: {
		"name": "Şahin",
		"effect_id": 9651,
		"gift_id": 12922,
		"icon": "/room-assets/live-gifts/icons/12922.webp",
		"video": "/room-assets/live-gifts/9651.mp4",
		"dat": 1100,
		"reward_dat": 550
	},
	live_12680: {
		"name": "Seviye Atlama Manzarası",
		"effect_id": 11579,
		"gift_id": 12680,
		"icon": "/room-assets/live-gifts/icons/12680.webp",
		"video": "/room-assets/live-gifts/11579.mp4",
		"dat": 1300,
		"reward_dat": 650
	},
	live_946670: {
		"name": "Gündüz Lansmanı",
		"effect_id": 119075,
		"gift_id": 946670,
		"icon": "/room-assets/live-gifts/icons/946670.webp",
		"video": "/room-assets/live-gifts/119075.mp4",
		"dat": 1400,
		"reward_dat": 700
	},
	live_53761: {
		"name": "Asya Çitası",
		"effect_id": 21961,
		"gift_id": 53761,
		"icon": "/room-assets/live-gifts/icons/53761.webp",
		"video": "/room-assets/live-gifts/21961.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_17446: {
		"name": "Legendary Aegis",
		"effect_id": 19752,
		"gift_id": 17446,
		"icon": "/room-assets/live-gifts/icons/17446.webp",
		"video": "/room-assets/live-gifts/19752.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_101857: {
		"name": "Fırtına Kılıcı",
		"effect_id": 27366,
		"gift_id": 101857,
		"icon": "/room-assets/live-gifts/icons/101857.webp",
		"video": "/room-assets/live-gifts/27366.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_19134: {
		"name": "Paris",
		"effect_id": 6718,
		"gift_id": 19134,
		"icon": "/room-assets/live-gifts/icons/19134.webp",
		"video": "/room-assets/live-gifts/6718.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_8603: {
		"name": "Leopar",
		"effect_id": 13972,
		"gift_id": 8603,
		"icon": "/room-assets/live-gifts/icons/8603.webp",
		"video": "/room-assets/live-gifts/13972.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_59710: {
		"name": "Zamanı Geri Sarma Cihazı",
		"effect_id": 23817,
		"gift_id": 59710,
		"icon": "/room-assets/live-gifts/icons/59710.webp",
		"video": "/room-assets/live-gifts/23817.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_547119: {
		"name": "Siyah Kurt",
		"effect_id": 33401,
		"gift_id": 547119,
		"icon": "/room-assets/live-gifts/icons/547119.webp",
		"video": "/room-assets/live-gifts/33401.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_18792: {
		"name": "LNY At",
		"effect_id": 21637,
		"gift_id": 18792,
		"icon": "/room-assets/live-gifts/icons/18792.webp",
		"video": "/room-assets/live-gifts/21637.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_18337: {
		"name": "Yenilmez Çekiç",
		"effect_id": 21268,
		"gift_id": 18337,
		"icon": "/room-assets/live-gifts/icons/18337.webp",
		"video": "/room-assets/live-gifts/21268.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_14562: {
		"name": "Savaş Şampiyonu",
		"effect_id": 8654,
		"gift_id": 14562,
		"icon": "/room-assets/live-gifts/icons/14562.webp",
		"video": "/room-assets/live-gifts/8654.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_54539: {
		"name": "Gelgit Çağıran Üçlü Mızrak",
		"effect_id": 22067,
		"gift_id": 54539,
		"icon": "/room-assets/live-gifts/icons/54539.webp",
		"video": "/room-assets/live-gifts/22067.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_54728: {
		"name": "Sinsi Jokey",
		"effect_id": 22270,
		"gift_id": 54728,
		"icon": "/room-assets/live-gifts/icons/54728.webp",
		"video": "/room-assets/live-gifts/22270.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_8912: {
		"name": "Gül Nebulası",
		"effect_id": 6629,
		"gift_id": 8912,
		"icon": "/room-assets/live-gifts/icons/8912.webp",
		"video": "/room-assets/live-gifts/6629.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_10670: {
		"name": "Gelecek Yolculuğu",
		"effect_id": 7185,
		"gift_id": 10670,
		"icon": "/room-assets/live-gifts/icons/10670.webp",
		"video": "/room-assets/live-gifts/7185.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_11586: {
		"name": "Parti Hiç Bitmesin",
		"effect_id": 10495,
		"gift_id": 11586,
		"icon": "/room-assets/live-gifts/icons/11586.webp",
		"video": "/room-assets/live-gifts/10495.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_12041: {
		"name": "Alev Kuleleri",
		"effect_id": 9623,
		"gift_id": 12041,
		"icon": "/room-assets/live-gifts/icons/12041.webp",
		"video": "/room-assets/live-gifts/9623.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_13006: {
		"name": "At",
		"effect_id": 11175,
		"gift_id": 13006,
		"icon": "/room-assets/live-gifts/icons/13006.webp",
		"video": "/room-assets/live-gifts/11175.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_13008: {
		"name": "Kar Leoparı",
		"effect_id": 11385,
		"gift_id": 13008,
		"icon": "/room-assets/live-gifts/icons/13008.webp",
		"video": "/room-assets/live-gifts/11385.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_972120: {
		"name": "Kar Ayı Şemsiyesi",
		"effect_id": 113874,
		"gift_id": 972120,
		"icon": "/room-assets/live-gifts/icons/972120.webp",
		"video": "/room-assets/live-gifts/113874.mp4",
		"dat": 1500,
		"reward_dat": 750
	},
	live_105817: {
		"name": "Stad",
		"effect_id": 23552,
		"gift_id": 105817,
		"icon": "/room-assets/live-gifts/icons/105817.webp",
		"video": "/room-assets/live-gifts/23552.mp4",
		"dat": 1600,
		"reward_dat": 800
	},
	live_9466: {
		"name": "Lunapark",
		"effect_id": 6797,
		"gift_id": 9466,
		"icon": "/room-assets/live-gifts/icons/9466.webp",
		"video": "/room-assets/live-gifts/6797.mp4",
		"dat": 1700,
		"reward_dat": 850
	},
	live_59885: {
		"name": "Zırh Dünyaya Karşı",
		"effect_id": 23757,
		"gift_id": 59885,
		"icon": "/room-assets/live-gifts/icons/59885.webp",
		"video": "/room-assets/live-gifts/23757.mp4",
		"dat": 1900,
		"reward_dat": 950
	},
	live_115549: {
		"name": "Red Devil Corgi",
		"effect_id": 23765,
		"gift_id": 115549,
		"icon": "/room-assets/live-gifts/icons/115549.webp",
		"video": "/room-assets/live-gifts/23765.mp4",
		"dat": 2e3,
		"reward_dat": 1e3
	},
	live_677594: {
		"name": "Corgi's Drone Show",
		"effect_id": 33335,
		"gift_id": 677594,
		"icon": "/room-assets/live-gifts/icons/677594.webp",
		"video": "/room-assets/live-gifts/33335.mp4",
		"dat": 2e3,
		"reward_dat": 1e3
	},
	live_10022: {
		"name": "Gyeongbokgung",
		"effect_id": 7016,
		"gift_id": 10022,
		"icon": "/room-assets/live-gifts/icons/10022.webp",
		"video": "/room-assets/live-gifts/7016.mp4",
		"dat": 2e3,
		"reward_dat": 1e3
	},
	live_12853: {
		"name": "Seviye Gemisi",
		"effect_id": 12230,
		"gift_id": 12853,
		"icon": "/room-assets/live-gifts/icons/12853.webp",
		"video": "/room-assets/live-gifts/12230.mp4",
		"dat": 2100,
		"reward_dat": 1050
	},
	live_18338: {
		"name": "Siber Kükreyiş",
		"effect_id": 21267,
		"gift_id": 18338,
		"icon": "/room-assets/live-gifts/icons/18338.webp",
		"video": "/room-assets/live-gifts/21267.mp4",
		"dat": 2600,
		"reward_dat": 1300
	},
	live_59711: {
		"name": "Işık Kalesi",
		"effect_id": 23816,
		"gift_id": 59711,
		"icon": "/room-assets/live-gifts/icons/59711.webp",
		"video": "/room-assets/live-gifts/23816.mp4",
		"dat": 2600,
		"reward_dat": 1300
	},
	live_101862: {
		"name": "Skyforge Kalesi",
		"effect_id": 27368,
		"gift_id": 101862,
		"icon": "/room-assets/live-gifts/icons/101862.webp",
		"video": "/room-assets/live-gifts/27368.mp4",
		"dat": 2600,
		"reward_dat": 1300
	},
	live_54540: {
		"name": "Denizaltı Krallığı",
		"effect_id": 22084,
		"gift_id": 54540,
		"icon": "/room-assets/live-gifts/icons/54540.webp",
		"video": "/room-assets/live-gifts/22084.mp4",
		"dat": 2600,
		"reward_dat": 1300
	},
	live_7400: {
		"name": "Adam'ın Hayali",
		"effect_id": 7797,
		"gift_id": 7400,
		"icon": "/room-assets/live-gifts/icons/7400.webp",
		"video": "/room-assets/live-gifts/7797.mp4",
		"dat": 2600,
		"reward_dat": 1300
	},
	live_972130: {
		"name": "Kardan Doğan Rin",
		"effect_id": 114102,
		"gift_id": 972130,
		"icon": "/room-assets/live-gifts/icons/972130.webp",
		"video": "/room-assets/live-gifts/114102.mp4",
		"dat": 2600,
		"reward_dat": 1300
	},
	live_7610: {
		"name": "Ejderha Alevi",
		"effect_id": 23504,
		"gift_id": 7610,
		"icon": "/room-assets/live-gifts/icons/7610.webp",
		"video": "/room-assets/live-gifts/23504.mp4",
		"dat": 2700,
		"reward_dat": 1350
	},
	live_17710: {
		"name": "Topluluk Efsaneleri",
		"effect_id": 19898,
		"gift_id": 17710,
		"icon": "/room-assets/live-gifts/icons/17710.webp",
		"video": "/room-assets/live-gifts/19898.mp4",
		"dat": 3e3,
		"reward_dat": 1500
	},
	live_10065: {
		"name": "Gorilla",
		"effect_id": 6461,
		"gift_id": 10065,
		"icon": "/room-assets/live-gifts/icons/10065.webp",
		"video": "/room-assets/live-gifts/6461.mp4",
		"dat": 3e3,
		"reward_dat": 1500
	},
	live_6369: {
		"name": "Aslan",
		"effect_id": 6585,
		"gift_id": 6369,
		"icon": "/room-assets/live-gifts/icons/6369.webp",
		"video": "/room-assets/live-gifts/6585.mp4",
		"dat": 3e3,
		"reward_dat": 1500
	},
	live_8624: {
		"name": "Zeus",
		"effect_id": 6401,
		"gift_id": 8624,
		"icon": "/room-assets/live-gifts/icons/8624.webp",
		"video": "/room-assets/live-gifts/6401.mp4",
		"dat": 3400,
		"reward_dat": 1700
	},
	live_7823: {
		"name": "Leon ve Aslan",
		"effect_id": 7575,
		"gift_id": 7823,
		"icon": "/room-assets/live-gifts/icons/7823.webp",
		"video": "/room-assets/live-gifts/7575.mp4",
		"dat": 3400,
		"reward_dat": 1700
	},
	live_8651: {
		"name": "Savaşan Şahin",
		"effect_id": 23503,
		"gift_id": 8651,
		"icon": "/room-assets/live-gifts/icons/8651.webp",
		"video": "/room-assets/live-gifts/23503.mp4",
		"dat": 4e3,
		"reward_dat": 2e3
	},
	live_8582: {
		"name": "TikTok Stars",
		"effect_id": 7383,
		"gift_id": 8582,
		"icon": "/room-assets/live-gifts/icons/8582.webp",
		"video": "/room-assets/live-gifts/7383.mp4",
		"dat": 4e3,
		"reward_dat": 2e3
	},
	live_9092: {
		"name": "Ateş Anka kuşu",
		"effect_id": 6669,
		"gift_id": 9092,
		"icon": "/room-assets/live-gifts/icons/9092.webp",
		"video": "/room-assets/live-gifts/6669.mp4",
		"dat": 4200,
		"reward_dat": 2100
	},
	live_9427: {
		"name": "Kanatlı At",
		"effect_id": 8883,
		"gift_id": 9427,
		"icon": "/room-assets/live-gifts/icons/9427.webp",
		"video": "/room-assets/live-gifts/8883.mp4",
		"dat": 4300,
		"reward_dat": 2150
	},
	live_59712: {
		"name": "Kral Leonardo",
		"effect_id": 23815,
		"gift_id": 59712,
		"icon": "/room-assets/live-gifts/icons/59712.webp",
		"video": "/room-assets/live-gifts/23815.mp4",
		"dat": 4300,
		"reward_dat": 2150
	},
	live_54541: {
		"name": "Efsane Marcellus",
		"effect_id": 22064,
		"gift_id": 54541,
		"icon": "/room-assets/live-gifts/icons/54541.webp",
		"video": "/room-assets/live-gifts/22064.mp4",
		"dat": 4300,
		"reward_dat": 2150
	},
	live_972138: {
		"name": "Yuki'nin Nöbeti",
		"effect_id": 114225,
		"gift_id": 972138,
		"icon": "/room-assets/live-gifts/icons/972138.webp",
		"video": "/room-assets/live-gifts/114225.mp4",
		"dat": 4300,
		"reward_dat": 2150
	},
	live_101868: {
		"name": "Valerian Yemini",
		"effect_id": 27367,
		"gift_id": 101868,
		"icon": "/room-assets/live-gifts/icons/101868.webp",
		"video": "/room-assets/live-gifts/27367.mp4",
		"dat": 4400,
		"reward_dat": 2200
	},
	live_18339: {
		"name": "Şampiyon Julius",
		"effect_id": 21266,
		"gift_id": 18339,
		"icon": "/room-assets/live-gifts/icons/18339.webp",
		"video": "/room-assets/live-gifts/21266.mp4",
		"dat": 4400,
		"reward_dat": 2200
	}
};
function livePremiumGift(type) {
	return Object.prototype.hasOwnProperty.call(LIVE_PREMIUM_GIFTS, type) ? LIVE_PREMIUM_GIFTS[type] : void 0;
}
var source_ignore_photo_default = "/assets/source-ignore-photo-DH9lpopo.svg";
var badges = {};
var EMBLEMS = {
	star: "<path d=\"M12 3.2l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.5l6-.7z\"/>",
	gem: "<path d=\"M6.5 5h11l3.5 4.6L12 20.5 3 9.6z\"/><path d=\"M3 9.6h18M9 5l-1.5 4.6L12 20.5 16.5 9.6 15 5\" fill=\"none\" stroke=\"rgba(0,0,0,.28)\" stroke-width=\"1\"/>",
	crown: "<path d=\"M3.5 18.5L2.8 8l5 4.2L12 5l4.2 7.2 5-4.2-.7 10.5z\"/><circle cx=\"12\" cy=\"4.3\" r=\"1.6\"/>",
	wings: "<path d=\"M12 10.5C9.5 6 5 5.2 1.5 6.8c2.6.6 4 2 4.6 3.6-1.8-.2-3.2.5-4 1.7 2.2-.3 4 .4 5 1.7-1.3.5-2 1.6-2 2.8 2.6-1.6 5-2.4 6.9-2.7zM12 10.5c2.5-4.5 7-5.3 10.5-3.7-2.6.6-4 2-4.6 3.6 1.8-.2 3.2.5 4 1.7-2.2-.3-4 .4-5 1.7 1.3.5 2 1.6 2 2.8-2.6-1.6-5-2.4-6.9-2.7z\"/><circle cx=\"12\" cy=\"12.6\" r=\"2.6\"/>",
	flame: "<path d=\"M12 2.5c1.6 4.2 6.3 5.8 5.9 11.4-.3 3.9-3 6.6-5.9 6.6s-5.7-2.3-5.9-6c-.2-3.3 2-5 2.6-7.8 1.5 1.3 1.9 3 1.8 4.6 1.6-2.2 2.1-5.3 1.5-8.8z\"/><path d=\"M12 12.5c1 1.8 2.6 2.5 2.4 4.6-.1 1.5-1.2 2.6-2.4 2.6s-2.3-1-2.4-2.4c-.1-1.5.9-2.3 1.2-3.5.5.6.7 1.2.7 1.8.6-.9.8-1.8.5-3.1z\" fill=\"rgba(255,255,255,.75)\"/>"
};
/** Original source SVG badge artwork, independent of browser globals. */
function entryBadge(Z) {
	Z = Math.max(1, Math.min(100, 0 | Z));
	const cached = badges[Z];
	if (cached) return cached;
	const J = tier(Z), tt = Z >= 100 ? 68 : Z >= 10 ? 60 : 52, Mt = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + tt + "\" height=\"24\" viewBox=\"0 0 " + tt + " 24\"><defs>" + (9 === J.i || J.i === TIERS.length - 1 ? "<linearGradient id=\"f\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffd86b\"/><stop offset=\".5\" stop-color=\"#ff2f6d\"/><stop offset=\"1\" stop-color=\"#7b2cff\"/></linearGradient>" : "<linearGradient id=\"f\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"" + J.c1 + "\"/><stop offset=\"1\" stop-color=\"" + J.c2 + "\"/></linearGradient>") + "<linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".55\"/><stop offset=\".55\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient></defs><rect x=\"1\" y=\"1\" width=\"" + (tt - 2) + "\" height=\"22\" rx=\"11\" fill=\"url(#f)\" stroke=\"" + J.rim + "\" stroke-width=\"1.5\"/><rect x=\"3\" y=\"2.5\" width=\"" + (tt - 6) + "\" height=\"9\" rx=\"4.5\" fill=\"url(#g)\"/><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"rgba(0,0,0,.28)\"/><g transform=\"translate(3.6 3.6) scale(.7)\" fill=\"#fff\" stroke=\"rgba(0,0,0,.25)\" stroke-width=\".8\">" + EMBLEMS[J.emblem] + "</g><text x=\"" + (tt / 2 + 11) + "\" y=\"16.6\" text-anchor=\"middle\" font-family=\"Arial Black,Arial,sans-serif\" font-weight=\"900\" font-size=\"13\" fill=\"#fff\" stroke=\"rgba(0,0,0,.45)\" stroke-width=\"2.4\" paint-order=\"stroke\">" + Z + "</text></svg>";
	return badges[Z] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Mt);
}
/** Original KickoutPresenter presentation; unknown prices never become free actions. */
function SourceKickoutDialog({ player, self, assets, onClose, onConfirmed }) {
	const session = useSourceFeatureSession();
	const [help, setHelp] = (0, import_react.useState)(false), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	const inFlight = (0, import_react.useRef)(false);
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, []);
	const t = (key, ...args) => translate(assets, key, ...args);
	const state = player.id ? session.kickout?.targets[player.id] : void 0;
	const type = state?.kickAt && state.kickAt > now ? "save" : "kick";
	const permitted = Boolean(session.kickout && state && (session.kickout.vip || self && type === "save"));
	const description = self ? t(type === "save" ? "kickout:defend" : "kickout:desc") : t(type === "save" ? "kickout:save" : "kickout:kick", player.name, "30", "15");
	const text = (value) => value.replace(/<\/?styled>/g, "").replace(/<\/?b>/g, "").replace(/%\d+d\(([^|]+)\|[^)]+\)/g, "$1");
	const act = async () => {
		if (!permitted || !player.id || inFlight.current || self && type === "kick") return;
		inFlight.current = true;
		setBusy(true);
		setMessage("");
		try {
			const result = await executeSourceFeature(type === "kick" ? "user-kick" : "user-save", {
				userId: player.id,
				expectedPrice: session.kickout?.price ?? 0,
				referrer: "profile"
			});
			if (result.confirmed) onConfirmed();
			else {
				const reason = result.message ?? "";
				if (reason.includes("not_enough_gold")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
				setMessage(t(reason.includes("target_not_at_table") || reason.includes("not_at_table") ? "kickout:toast1" : reason.includes("already_kicked") ? "kickout:toast2" : reason.includes("already_saved") ? "kickout:toast3" : "kickout:toast4"));
			}
		} catch {
			setMessage(t("kickout:toast4"));
		} finally {
			inFlight.current = false;
			setBusy(false);
		}
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceFeaturePopup, {
		title: t("kickout:header"),
		onClose,
		help: () => setHelp(true),
		inactive: help,
		className: "source-kickout-popup",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, {
			cancel: self && type === "kick" && session.kickout?.vip ? void 0 : {
				title: t("kickout:btn_cancel"),
				onClick: onClose
			},
			confirm: permitted ? {
				title: t(self ? type === "save" ? "kickout:btn_defend" : "kickout:btn_ok" : type === "save" ? "kickout:btn_save" : "kickout:btn_kick"),
				enabled: !busy,
				onClick: self && type === "kick" ? onClose : () => void act()
			} : void 0,
			info: session.kickout && !session.kickout.vip && !(self && type === "save") ? {
				title: t("kickout:btn_know"),
				onClick: () => window.dispatchEvent(new Event(OPEN_VIP_EVENT))
			} : void 0
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kickout",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "kickout__user",
					children: [!(self && type === "kick") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "kickout__photo",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: player.photoUrl,
							alt: player.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `kickout__icon kickout__icon--${type}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `kickout__description${self && type === "kick" ? " kickout__description--center" : ""}`,
						children: text(description)
					})]
				}),
				type === "kick" && !self && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kickout__warning",
					children: t("kickout:warning")
				}),
				type === "save" && state?.kickAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "kickout__info",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__info-text",
						children: t("kickout:info:return")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__info-time",
						children: Math.max(0, Math.ceil((state.kickAt - now) / 1e3))
					})]
				}),
				session.kickout?.freeAt && session.kickout.freeAt > now && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kickout__price-info",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "kickout__price-info-text",
						children: [Math.ceil((session.kickout.freeAt - now) / 6e4), " min"]
					})
				}),
				session.kickout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "kickout__price-info",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__price-info-text",
						children: text(t(!session.kickout.vip && !(self && type === "save") ? self ? "kickout:vip3" : "kickout:vip1" : session.kickout.price ? "kickout:price" : "kickout:free"))
					}), permitted && session.kickout.price > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kickout__price",
						children: session.kickout.price
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "source-feature-message",
					role: "status",
					children: "Masadan çıxarma və qoruma xidməti qoşulmayıb; qiymət və qoruma müddəti təsdiqlənmədi."
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "source-feature-message",
					role: "status",
					children: message
				})
			]
		})
	}), help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceFeaturePopup, {
		title: t("kickout:help:header"),
		onClose: () => setHelp(false),
		className: "source-kickout-popup",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, { confirm: {
			title: t("kickout:help:btn_ok"),
			onClick: () => setHelp(false)
		} }),
		children: [
			"kickout:help:text1",
			"kickout:help:text2",
			"kickout:help:text3"
		].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "source-kickout-help",
			children: text(t(key, "30", "15"))
		}, key))
	})] }), document.body);
}
/** Both own-photo and table settings open the same original Telegram edit dialog. */
function SourceProfileSettings({ assets, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileInfoDialog, {
		assets,
		onClose
	});
}
function splitThousands(n) {
	return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
var rank = (r) => r && r < 5e3 ? splitThousands(r) : void 0;
function formatStats(p) {
	return {
		totalKisses: splitThousands(p.total_kisses),
		totalKissesRank: rank(p.total_kisses_rank),
		djScore: splitThousands(p.dj_score),
		djRank: rank(p.dj_score_rank),
		gestures: splitThousands(p.gestures),
		gesturesRank: rank(p.gestures_rank),
		price: splitThousands(p.price),
		priceRank: rank(p.price_rank),
		haremPrice: splitThousands(p.harem_price),
		haremPriceRank: rank(p.harem_price_rank)
	};
}
/** formatHarem: price shown is price + 1; button disabled when the viewer already owns the user. */
function formatHarem(userIsViewer, userId, profile) {
	const owner = profile?.owner;
	const noOwner = !owner || owner.id === userId;
	const btnIsDisabled = Boolean(noOwner ? userIsViewer : owner.viewer);
	return {
		price: profile ? splitThousands(profile.price + 1) : void 0,
		priceRank: profile?.price_rank && profile.price_rank < 5e3 ? profile.price_rank : 0,
		noOwner,
		owner: noOwner ? void 0 : owner,
		btnIsDisabled,
		btnKey: userIsViewer && !btnIsDisabled ? "dlg:profile:harem:leave" : "dlg:profile:harem:btn"
	};
}
/** Splits a status into plain text and emoji runs (source jsxReplaceRe with EMOJI_RE). */
function splitStatusEmoji(text) {
	const re = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|\p{Emoji_Modifier})*)+/gu;
	const out = [];
	let last = 0;
	for (const m of text.matchAll(re)) {
		if (m.index > last) out.push({
			text: text.slice(last, m.index),
			emoji: false
		});
		out.push({
			text: m[0],
			emoji: true
		});
		last = m.index + m[0].length;
	}
	if (last < text.length) out.push({
		text: text.slice(last),
		emoji: false
	});
	return out;
}
/** Original label priority: current TOP takes precedence over an active VIP. */
function profileRibbon(top, vip) {
	return top ? "top" : vip ? "vip" : null;
}
/** Source photo/user reports: stored server-side in the admin report queue (one open report per kind). */
async function reportPlayer(userId, kind, text) {
	const sb = getSupabase();
	if (!sb) return "error";
	const { data, error } = await sb.rpc("report_player", {
		p_user: userId,
		p_kind: kind,
		p_text: text
	});
	if (error) return "error";
	return data === "already" ? "already" : "sent";
}
var Div = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	role: p.onClick ? "button" : void 0,
	...p
});
/** Port of StatusJSX: long statuses collapse to two 16px rows and expand on tap; emoji get their own span. */
function SourceStatus({ text }) {
	const ref = (0, import_react.useRef)(null);
	const initRows = (0, import_react.useRef)(0);
	const update = () => {
		const el = ref.current;
		if (!el) return;
		const lineHeight = 16, narrowedRows = 2;
		const currentRows = Math.floor(el.clientHeight / lineHeight);
		if (currentRows < narrowedRows) return;
		if (initRows.current < currentRows) initRows.current = currentRows;
		const toNarrow = currentRows !== narrowedRows;
		el.classList.toggle("user-profile__status--narrowed", toNarrow);
		el.classList.toggle("user-profile__status--pointer", initRows.current > narrowedRows);
		el.style.height = `${lineHeight * (toNarrow ? narrowedRows : initRows.current)}px`;
	};
	(0, import_react.useLayoutEffect)(() => {
		initRows.current = 0;
		const el = ref.current;
		if (el) {
			el.style.height = "";
			el.classList.remove("user-profile__status--narrowed", "user-profile__status--pointer");
		}
		update();
	}, [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "user-profile__status",
		onClick: update,
		children: splitStatusEmoji(text).map((part, i) => part.emoji ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "user-profile__status-emoji",
			children: part.text
		}, i) : part.text)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "user-profile__stats-border" })] });
}
/** Port of UserProfileDialog + UserProfilePresenter (Telegram client 1.6.393). */
function ProfileDialog({ player, self, assets, onClose, onGift, onDecor, onMusic, profile: profileProp = null }) {
	const t = (key, ...a) => translate(assets, key, ...a);
	const viewerVip = useViewerProgress().vip;
	const [vipNow, setVipNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (self || !player.vipUntil || player.vipUntil <= Date.now()) return;
		const id = window.setTimeout(() => setVipNow(Date.now()), Math.min(player.vipUntil - Date.now() + 50, 2 ** 31 - 1));
		return () => window.clearTimeout(id);
	}, [
		self,
		player.vipUntil,
		vipNow
	]);
	const vipLabel = self ? viewerVip : Boolean(player.vipUntil && player.vipUntil > vipNow);
	const [leagueTop, setLeagueTop] = (0, import_react.useState)(false);
	const ribbon = profileRibbon(leagueTop, vipLabel);
	const [statsState, setStatsState] = (0, import_react.useState)("narrowed");
	const [popup, setPopup] = (0, import_react.useState)(null);
	const [loaded, setLoaded] = (0, import_react.useState)(null);
	const profile = profileProp ?? loaded;
	const sectionRef = (0, import_react.useRef)(null);
	const [infoSize, setInfoSize] = (0, import_react.useState)(0);
	const [portrait, setPortrait] = (0, import_react.useState)(true);
	const [report, setReport] = (0, import_react.useState)("");
	const feature = useSourceFeatureSession();
	const room = useRoom();
	const atTable = profileIsAtTable(player.id, room.players);
	const stone = player.stone && assets.stones[player.stone] ? dialogImage(assets, assets.stones[player.stone].image, 15, 15) : null;
	const blockedUsers = useBlockedUsers();
	const blocked = Boolean(player.id && blockedUsers.has(player.id));
	const [blocking, setBlocking] = (0, import_react.useState)(false);
	const [tooltip, setTooltip] = (0, import_react.useState)(null);
	const tooltipTimer = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => () => window.clearTimeout(tooltipTimer.current), []);
	const showTooltip = (text) => {
		if (!text) return;
		window.clearTimeout(tooltipTimer.current);
		setTooltip(text);
		tooltipTimer.current = window.setTimeout(() => setTooltip(null), 3e3);
	};
	const stats = profile ? formatStats(profile) : null;
	const userId = self ? feature.viewerId ?? void 0 : player.id;
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		setLeagueTop(false);
		if (!sb || !userId) return;
		let alive = true, revision = 0;
		const load = async () => {
			const r = ++revision;
			const { data, error } = await sb.rpc("profile_league_top", { p_user: userId });
			if (alive && r === revision && !error) setLeagueTop(data === true);
		};
		load();
		const ch = sb.channel(`profile-top-${userId}-${Math.random()}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "league_members"
		}, () => void load()).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "league_rounds"
		}, () => void load()).subscribe();
		const timer = window.setInterval(() => void load(), 5e3);
		return () => {
			alive = false;
			window.clearInterval(timer);
			sb.removeChannel(ch);
		};
	}, [userId]);
	const [ranking, setRanking] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb || !userId) return;
		let alive = true, revision = 0;
		const load = async () => {
			const current = ++revision;
			const { data, error } = await sb.rpc("player_level_activity", { p_user: userId });
			if (alive && current === revision && !error && data) setRanking({
				...data,
				userId
			});
		};
		load();
		const timer = window.setInterval(() => void load(), 5e3);
		return () => {
			alive = false;
			window.clearInterval(timer);
		};
	}, [userId]);
	const ranks = ranking?.userId === userId ? ranking : null;
	const [heartSenders, setHeartSenders] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb || !userId) return;
		let alive = true, revision = 0;
		const load = async () => {
			const current = ++revision;
			const { data, error } = await sb.rpc("player_heart_senders", { p_user: userId });
			if (alive && current === revision && !error) setHeartSenders({
				userId,
				rows: data ?? []
			});
		};
		load();
		const timer = window.setInterval(() => void load(), 1e4);
		return () => {
			alive = false;
			window.clearInterval(timer);
		};
	}, [userId]);
	const [savedBio, setSavedBio] = (0, import_react.useState)(null);
	const bio = savedBio && savedBio.userId === userId ? savedBio.value : profile?.status;
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb || !userId) return;
		let alive = true;
		let revision = 0;
		const load = async () => {
			const current = ++revision;
			const value = await loadProfileBio(userId);
			if (alive && current === revision && value !== void 0) setSavedBio({
				userId,
				value
			});
		};
		load();
		const ch = sb.channel(`profile-bio-${userId}-${Math.random().toString(36).slice(2)}`).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "profiles",
			filter: `id=eq.${userId}`
		}, () => void load()).subscribe();
		const timer = window.setInterval(() => void load(), 5e3);
		return () => {
			alive = false;
			window.clearInterval(timer);
			sb.removeChannel(ch);
		};
	}, [userId]);
	const harem = formatHarem(self, userId ?? "", profile);
	(0, import_react.useLayoutEffect)(() => {
		const el = sectionRef.current;
		if (!el) return;
		const measure = () => {
			const isPortrait = window.innerHeight >= window.innerWidth;
			setPortrait(isPortrait);
			setInfoSize(Math.max(0, Math.floor(Math.min(el.clientWidth, el.clientHeight || window.innerHeight * .94))));
		};
		measure();
		const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
		ro?.observe(el);
		window.addEventListener("resize", measure);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const sb = getSupabase();
		if (!sb || !userId || profileProp) return;
		let alive = true;
		const load = async () => {
			const { data, error } = await sb.rpc("user_profile_stats", { p_user: userId });
			if (!alive || error || !data) return;
			const raw = data;
			const o = raw.owner;
			const owner = o ? {
				id: o.id,
				name: o.name,
				male: o.male,
				photoUrl: o.photo_url || player.photoUrl,
				color: o.male ? "3b7dd8" : "e0458c",
				viewer: o.id === feature.viewerId
			} : void 0;
			setLoaded({
				...raw,
				...owner ? { owner } : { owner: void 0 }
			});
		};
		load();
		loadRef.current = load;
		const ch = sb.channel(`profile-${userId}-${Math.random().toString(36).slice(2)}`).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "profiles",
			filter: `id=eq.${userId}`
		}, () => void load()).subscribe();
		const timer = window.setInterval(() => void load(), 5e3);
		return () => {
			alive = false;
			window.clearInterval(timer);
			sb.removeChannel(ch);
		};
	}, [userId, profileProp]);
	const loadRef = (0, import_react.useRef)(async () => {});
	const [buying, setBuying] = (0, import_react.useState)(false);
	const noServer = () => showSourceToast("Oyunçu hesabına giriş edilməyib; bu əməliyyat serverdə yerinə yetirilə bilmir.");
	(0, import_react.useEffect)(() => {
		const key = (e) => {
			if (!popup && e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", key);
		return () => document.removeEventListener("keydown", key);
	}, [onClose, popup]);
	const statItem = (kind, title, sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "user-profile__stats-item",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `user-profile__stats-icon user-profile__stats-icon--${kind}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `user-profile__stats-item-title user-profile__stats-item-title--${kind}`,
				children: title ?? "—"
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "user-profile__stats-item-subtitle",
				children: [
					sub,
					" ",
					t("dlg:profile:rank")
				]
			})
		]
	}, kind);
	const big = Boolean(stats && profile?.total_kisses && profile?.dj_score && profile?.gestures);
	const onSendMessage = () => {
		if (self) {
			showSourceToast(t("warning:self_chat:desc"));
			return;
		}
		if (!atTable) {
			showSourceToast(t("warning:offline_chat:desc"));
			return;
		}
		if (!player.id) {
			noServer();
			return;
		}
		window.dispatchEvent(new CustomEvent("game-reply-to", { detail: {
			id: player.id,
			name: player.name,
			photoUrl: player.photoUrl,
			male: player.male,
			private: true
		} }));
		onClose();
	};
	const onSendGift = () => {
		if (!atTable) {
			showSourceToast(t("warning:offline_gift:desc"));
			return;
		}
		onGift();
	};
	const onKickout = () => {
		if (!atTable) {
			showSourceToast(t("dlg:profile:toast1"));
			return;
		}
		setPopup("kickout");
	};
	const onHarem = () => {
		if (self && harem.noOwner) {
			showSourceToast(t("dlg:profile:harem:tooltip"));
			return;
		}
		if (harem.owner?.viewer) {
			showSourceToast(t("dlg:profile:harem:purchased", player.name));
			return;
		}
		const sb = getSupabase();
		if (!sb || !userId || buying) {
			if (!userId) noServer();
			return;
		}
		setBuying(true);
		sb.rpc("harem_purchase", { p_target: userId }).then(({ error }) => {
			setBuying(false);
			if (error) {
				if (error.message.includes("not_enough_gold")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
				else showSourceToast("Alış baş tutmadı.");
				return;
			}
			showSourceToast(t("dlg:profile:harem:purchased", player.name));
			loadRef.current();
		});
	};
	const sendReport = async (kind, text) => {
		if (!player.id || self) return;
		const result = await reportPlayer(player.id, kind, text);
		showSourceToast(result === "error" ? "Şikayət göndərilmədi." : t("dlg:report_photo:toast"));
	};
	const onBlock = () => {
		if (!player.id || self || blocking) return;
		setBlocking(true);
		setUserBlocked(player.id, !blocked).then(() => showSourceToast(t(blocked ? "hint:icon:unblock" : "hint:icon:block"))).catch(() => showSourceToast("Əməliyyat yerinə yetirilmədi.")).finally(() => setBlocking(false));
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `profile-layer ${portrait ? "portrait" : "landscape"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: onClose
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				ref: sectionRef,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": player.name,
				className: "popup popup--center popup--show user-profile__x_popup",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
						className: "popup__close popup__close--dlg",
						"aria-label": "Bağla",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "popup__close-icon" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "user-profile",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "user-profile__info",
							style: infoSize ? {
								width: `${infoSize}px`,
								height: `${infoSize}px`
							} : void 0,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
									className: "user-profile__photos",
									"aria-label": self ? t("dlg:profile_info:title") : void 0,
									onClick: self ? () => setPopup("settings") : void 0,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "user-profile__swiper",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "user-profile__photo",
											role: "img",
											"aria-label": player.name,
											style: { backgroundImage: `url('${player.photoUrl}')` }
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "user-profile__shadow" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "user-profile__title",
									children: [stone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "user-profile__decored-name",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: "user-profile__stone",
												src: stone.src,
												width: stone.width,
												height: stone.height,
												alt: ""
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "user-profile__name",
												children: [player.name, player.age ? `, ${player.age}` : ""]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: "user-profile__stone",
												src: stone.src,
												width: stone.width,
												height: stone.height,
												alt: ""
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "user-profile__name",
										children: [player.name, player.age ? `, ${player.age}` : ""]
									}), player.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "user-profile__city",
										children: player.city
									})]
								}),
								player.zodiac !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
									className: `user-profile__zodiac user-profile__zodiac--${player.zodiac}`,
									onClick: () => showTooltip(t(`hint:zodiac:${player.zodiac}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "user-profile__tooltip",
									style: { display: tooltip ? "block" : "none" },
									children: tooltip
								}),
								self && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
									className: "user-profile__decor",
									"aria-label": "Bəzəklər",
									onClick: onDecor
								}),
								!self && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
									className: "user-profile__claim",
									"aria-label": "Şikayət",
									onClick: () => setPopup("claims")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "user-profile__details",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "user-profile__scrollable",
								children: [
									bio && infoSize > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceStatus, { text: bio }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `user-profile__stats${big ? " user-profile__stats--big" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "user-profile__counters",
											children: [
												statItem("kiss", stats?.totalKisses, stats?.totalKissesRank),
												statItem("dj", stats?.djScore, stats?.djRank),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `user-profile__hidden-stats-items user-profile__hidden-stats-items--${statsState}`,
													children: [
														statItem("price", stats?.price, stats?.priceRank),
														statItem("harem-price", stats?.haremPrice, stats?.haremPriceRank),
														statItem("glv", ranks ? String(ranks.level) : void 0, ranks?.level_rank ? ranks.level_rank.toLocaleString("tr-TR") : void 0),
														statItem("activity", ranks ? activityText(ranks.activity_minutes, true) : void 0, ranks?.activity_rank && ranks.activity_rank < 5e3 ? ranks.activity_rank.toLocaleString("tr-TR") : void 0)
													]
												}),
												statItem("gesture", stats?.gestures, stats?.gesturesRank)
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "user-profile__stats-border-item",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "user-profile__stats-border" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
												className: `user-profile__stats-expand-icon${statsState === "expanded" ? " user-profile__stats-expand-icon--expanded" : ""}`,
												"aria-label": "Statistika",
												onClick: () => setStatsState((s) => s === "expanded" ? "narrowed" : "expanded")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "user-profile__stats-border" })
										]
									}),
									heartSenders && heartSenders.userId === userId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										"aria-label": "Hədiyyə göndərənlər",
										style: { padding: "8px 12px" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: 12,
												marginBottom: 6
											},
											children: "Ürək / hədiyyə göndərənlər"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											style: {
												display: "flex",
												gap: 6,
												overflowX: "auto"
											},
											children: [heartSenders.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontSize: 12 },
												children: "Hələ hədiyyə göndərən yoxdur"
											}), heartSenders.rows.map((sender) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												title: sender.name,
												"aria-label": `${sender.name} — profili aç`,
												style: {
													flex: "0 0 32px",
													padding: 0,
													border: 0,
													background: "transparent",
													cursor: "pointer"
												},
												onClick: () => {
													onClose();
													window.dispatchEvent(new CustomEvent("source:open-profile", { detail: sender.id }));
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: sender.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K",
													alt: sender.name,
													width: 32,
													height: 32,
													style: {
														borderRadius: "50%",
														objectFit: "cover"
													}
												})
											}, sender.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "user-profile__harem",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
											className: "user-profile__owner-photo",
											style: harem.owner ? { backgroundImage: `url('${harem.owner.photoUrl}')` } : void 0
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "user-profile__harem-info",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "user-profile__owner-description",
													children: [harem.owner ? t("dlg:profile:harem:owner_v2") : t("dlg:profile:harem:no_owner"), harem.owner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "user-profile__owner-name",
														style: { color: `#${harem.owner.color}` },
														children: harem.owner.name
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "user-profile__stats-item user-profile__stats-item--harem",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "user-profile__stats-icon user-profile__stats-icon--price" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "user-profile__stats-item-title",
															children: harem.price ?? "—"
														}),
														!!harem.priceRank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "user-profile__stats-item-subtitle",
															children: [
																harem.priceRank,
																" ",
																t("dlg:profile:rank")
															]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
													className: `button button--confirm user-profile__x_button${harem.btnIsDisabled ? " button--disabled" : ""}`,
													onClick: onHarem,
													children: t(harem.btnKey)
												})
											]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "user-profile__actions user-profile__actions--justify",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: `user-profile__action user-profile__action--kickout-${feature.kickout?.targets[player.id ?? ""]?.kickAt ? "save" : self ? "self" : "kick"}${atTable ? "" : " user-profile__action--greyscaled"}`,
										"aria-label": t("kickout:header"),
										title: t("kickout:header"),
										onClick: onKickout
									}),
									self ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
										className: "user-profile__action user-profile__action--music",
										"aria-label": "Musiqi",
										onClick: onMusic
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: `user-profile__action user-profile__action--gift${atTable ? "" : " user-profile__action--greyscaled"}`,
										"aria-label": "Hədiyyə",
										onClick: onSendGift
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Div, {
										className: "user-profile__action user-profile__action--achievements",
										"aria-label": "Nailiyyətlər",
										onClick: () => {
											if (userId) setPopup("achievements");
											else noServer();
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: `user-profile__action user-profile__action--message${atTable && !self ? "" : " user-profile__action--greyscaled"}`,
										"aria-label": "Mesaj",
										onClick: onSendMessage
									})
								]
							})]
						})]
					}),
					ribbon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-label": ribbon.toUpperCase(),
						className: `user-profile__label user-profile__label--${ribbon}`
					})
				]
			}),
			popup === "claims" && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "source-feature-layer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup-shade",
					onClick: () => setPopup(null)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					role: "dialog",
					"aria-modal": "true",
					className: "popup popup--center popup--show message-actions__x_popup",
					children: [
						{
							key: blocked ? "dlg:unblock:title" : "dlg:block:title",
							icon: "ignore",
							action: () => setPopup("block")
						},
						{
							key: "hint:report_photo",
							icon: "adult",
							action: () => setPopup("report-photo")
						},
						{
							key: "dlg:report_user:title",
							icon: "report",
							action: () => setPopup("report-user")
						}
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "button",
						className: "settings__item settings__item--selectable",
						onClick: i.action,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `settings__icon settings__icon--${i.icon}` }), t(i.key)]
					}, i.key))
				})]
			}), document.body),
			popup === "block" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceInfoDialog, {
				hasClose: true,
				title: t(blocked ? "dlg:unblock:title" : "dlg:block:title"),
				context: t(blocked ? "dlg:unblock:desc" : "dlg:block:desc", player.name),
				onClose: () => setPopup(null),
				confirm: {
					title: t(blocked ? "dlg:unblock:ok" : "dlg:block:block"),
					onClick: () => {
						setPopup(null);
						onBlock();
					}
				},
				cancel: {
					title: t(blocked ? "dlg:unblock:cancel" : "dlg:block:cancel"),
					onClick: () => setPopup(null)
				}
			}),
			popup === "report-photo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceInfoDialog, {
				hasClose: true,
				title: t("dlg:report_photo:title"),
				context: t("dlg:report_photo:desc"),
				onClose: () => setPopup(null),
				confirm: {
					title: t("dlg:report_photo:ok"),
					onClick: () => {
						setPopup(null);
						sendReport("photo", "");
					}
				},
				cancel: {
					title: t("dlg:report_photo:cancel"),
					onClick: () => setPopup(null)
				}
			}),
			popup === "report-user" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceDialogLayer, {
				title: t("dlg:report_user:title"),
				onClose: () => setPopup(null),
				onShade: () => setPopup(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__content",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "report",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 5,
							maxLength: 1e3,
							placeholder: t("dlg:report_user:hint"),
							onInput: (e) => setReport(e.target.value.trim())
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, {
					cancel: {
						title: t("dlg:report_user:cancel"),
						onClick: () => setPopup(null)
					},
					confirm: {
						title: t("dlg:report_user:send"),
						onClick: () => {
							if (!report) return;
							setPopup(null);
							sendReport("user", report);
							setReport("");
						}
					}
				})]
			}),
			popup === "achievements" && userId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceAchievementsDialog, {
				male: player.male,
				user: self ? void 0 : {
					id: userId,
					name: player.name,
					male: player.male
				},
				onClose: () => setPopup(null)
			}),
			popup === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceProfileSettings, {
				assets,
				name: player.name,
				photo: player.photoUrl,
				onClose: () => setPopup(null)
			}),
			popup === "kickout" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceKickoutDialog, {
				player,
				self,
				assets,
				onClose: () => setPopup(null),
				onConfirmed: onClose
			})
		]
	}), document.body);
}
function TableSeats() {
	const hostRef = (0, import_react.useRef)(null);
	const assets = useCilizAssets();
	const decor = useDecorState();
	const tableRef = (0, import_react.useRef)(null);
	const playersRef = (0, import_react.useRef)([]);
	const [target, setTarget] = (0, import_react.useState)(closedTarget);
	const giftSeat = target.receiver;
	const [activeTable, setActiveTable] = (0, import_react.useState)(null);
	const [gesturesOpen, setGesturesOpen] = (0, import_react.useState)(false);
	const targetRef = (0, import_react.useRef)(target);
	targetRef.current = target;
	const gesturesOpenRef = (0, import_react.useRef)(gesturesOpen);
	gesturesOpenRef.current = gesturesOpen;
	const progress = useViewerProgress();
	const room = useRoom();
	const blocked = useBlockedUsers();
	const ownKisses = room.players[5]?.kisses;
	(0, import_react.useEffect)(() => {
		if (ownKisses !== void 0) setViewerKisses(ownKisses);
	}, [ownKisses]);
	(0, import_react.useEffect)(() => {
		const open = (e) => {
			const seat = e.detail;
			if (seat !== 5 && playersRef.current[seat]) {
				setGesturesOpen(false);
				setTarget((state) => openFor(state, seat, 5));
			}
		};
		window.addEventListener(OPEN_GIFT_FOR_SEAT_EVENT, open);
		return () => window.removeEventListener(OPEN_GIFT_FOR_SEAT_EVENT, open);
	}, []);
	const [profileSeat, setProfileSeat] = (0, import_react.useState)(null);
	const [ownProfileOpen, setOwnProfileOpen] = (0, import_react.useState)(false);
	const [offTable, setOffTable] = (0, import_react.useState)(null);
	const assetsRef = (0, import_react.useRef)(null);
	assetsRef.current = assets ?? null;
	(0, import_react.useEffect)(() => {
		const open = (event) => {
			const id = event.detail;
			const seat = playersRef.current.findIndex((player) => player?.id === id);
			if (seat === 5) setOwnProfileOpen(true);
			else if (seat >= 0) setProfileSeat(seat);
			else if (id) getSupabase()?.from("profiles").select("*").eq("id", id).maybeSingle().then(({ data }) => {
				if (!data) return;
				const p = data;
				if (assetsRef.current) setOffTable(buildPlayers(assetsRef.current, [p], p.frame, p.stone)[0] ?? null);
			});
		};
		window.addEventListener("source:open-profile", open);
		return () => window.removeEventListener("source:open-profile", open);
	}, []);
	const [lockedGift, setLockedGift] = (0, import_react.useState)(null);
	const responseRef = (0, import_react.useRef)({ type: "ready" });
	const [response, setResponse] = (0, import_react.useState)(null);
	const offerResponse = (0, import_react.useCallback)((senderId, giftType) => {
		const next = onGiftToViewer(responseRef.current, senderId, giftType, Date.now());
		if (!next) return;
		responseRef.current = next;
		setResponse({
			senderId,
			giftType
		});
	}, []);
	const endResponse = (0, import_react.useCallback)((state) => {
		responseRef.current = state;
		setResponse(null);
	}, []);
	const giftItems = (0, import_react.useMemo)(() => assets ? buildGiftItems(assets, VIEWER_STORE.social, {
		kisses: progress.kisses,
		vip: progress.vip
	}) : [], [
		assets,
		progress.kisses,
		progress.vip
	]);
	const ownTokens = room.players[5]?.tokens;
	const ownId = room.players[5]?.id;
	const gestureAccount = (0, import_react.useMemo)(() => ownId && ownTokens !== void 0 ? {
		userId: ownId,
		kisses: progress.kisses,
		vip: progress.vip,
		tokens: ownTokens,
		social: VIEWER_STORE.social,
		platform: "web",
		scheduled: []
	} : null, [
		ownId,
		ownTokens,
		progress.kisses,
		progress.vip
	]);
	const localGestures = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!assets) return;
		return onRoomGesture((row) => {
			const seat = displaySeatOf(row.sender_id), g = assets.gestures?.[row.gesture];
			const sender = profileBySeat(seat);
			if (seat >= 0 && g && sender) {
				const im = dialogImage(assets, g.image, 40, 40);
				pushGestureLine({
					id: row.sender_id,
					name: sender.name ?? "",
					photoUrl: sender.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
				}, row.gesture, translate(assets, `gesture:${row.gesture}`), im?.src ?? g.image, row.id);
			}
			if (row.sender_id === playersRef.current[5]?.id && localGestures.current > 0) {
				localGestures.current--;
				return;
			}
			if (seat >= 0 && g) tableRef.current?.playGesture(seat, g).catch(() => {});
		});
	}, [assets]);
	(0, import_react.useEffect)(() => {
		if (lockedGift?.lock?.kind === "kisses" && progress.kisses >= lockedGift.lock.need) setLockedGift(null);
	}, [lockedGift, progress.kisses]);
	(0, import_react.useEffect)(() => {
		if (!assets || !hostRef.current) return;
		let disposed = false;
		const host = hostRef.current;
		import("./pixi-table-aPR3nwJb.mjs").then(async ({ createPixiTable }) => {
			const table = await createPixiTable(host, assets, {
				onSeatClick: (index) => {
					unlockSfx();
					const action = seatTapAction(targetRef.current, index, 5, gesturesOpenRef.current);
					if (action === "own-profile") {
						setGesturesOpen(false);
						setOwnProfileOpen(true);
						return;
					}
					if (action === "gestures") {
						setTarget(closedTarget);
						setGesturesOpen(true);
						return;
					}
					if (action === "profile") {
						setTarget(closedTarget);
						setProfileSeat(index);
						return;
					}
					setGesturesOpen(false);
					setTarget((state) => openFor(state, index, 5));
				},
				playSfx: (id) => void playSfx(assets.sfxUrl, id),
				prepareSfx: (id) => prepareSfx(assets.sfxUrl, id)
			});
			if (disposed) {
				table.destroy();
				return;
			}
			tableRef.current = table;
			setActiveTable(table);
			setSeatLocator((seat) => table.seatPoint(seat));
			completeLoadingStage("renderer");
		}).catch((error) => {
			console.error("Table loading failed", error);
			failGameLoading();
		});
		return () => {
			disposed = true;
			setSeatLocator(null);
			tableRef.current?.destroy();
			tableRef.current = null;
			setActiveTable(null);
		};
	}, [assets]);
	const seatSig = (0, import_react.useRef)({
		sig: "",
		table: null
	});
	(0, import_react.useEffect)(() => {
		if (!assets || !activeTable) return;
		const next = buildPlayers(assets, room.players, decor.frame, decor.stone);
		for (const player of next) if (player.id && blocked.has(player.id)) player.photoUrl = source_ignore_photo_default;
		playersRef.current = next;
		const sig = JSON.stringify(next.map((p) => [
			p.id,
			p.name,
			p.photoUrl,
			p.frame,
			p.stone,
			p.male,
			p.empty,
			p.age,
			p.city,
			p.vipUntil,
			p.kisses
		]));
		if (sig === seatSig.current.sig && seatSig.current.table === activeTable) return;
		seatSig.current = {
			sig,
			table: activeTable
		};
		activeTable.setPlayers(next);
	}, [
		assets,
		activeTable,
		room.players,
		decor.frame,
		decor.stone,
		blocked
	]);
	const ownProfile = room.players[5];
	(0, import_react.useEffect)(() => {
		if (ownProfile) syncDecorFromProfile(ownProfile);
	}, [ownProfile]);
	(0, import_react.useEffect)(() => {
		if (!assets) return;
		const pace = /* @__PURE__ */ new Map();
		const timers = /* @__PURE__ */ new Set();
		const off = onRoomGift((row) => {
			const created = Date.parse(row.created_at ?? "") || Date.now();
			const now = performance.now();
			let base = pace.get(row.sender_id);
			let delay = base ? created - base.server - (now - base.local) : 0;
			if (!base || delay < -300 || delay > 3e3) {
				base = {
					server: created,
					local: now
				};
				pace.set(row.sender_id, base);
				delay = 0;
			}
			if (delay <= 0) {
				play(row);
				return;
			}
			const id = window.setTimeout(() => {
				timers.delete(id);
				play(row);
			}, delay);
			timers.add(id);
		});
		return () => {
			off();
			timers.forEach((t) => window.clearTimeout(t));
		};
		function play(row) {
			if (!assets) return;
			let mine = false;
			const ownKey = `${row.seed}:${row.receiver_id}`;
			if (row.sender_id === playersRef.current[5]?.id && localSent.current.has(ownKey)) {
				localSent.current.delete(ownKey);
				mine = true;
			}
			const from = displaySeatOf(row.sender_id), to = displaySeatOf(row.receiver_id);
			const meta = assets.gifts[row.gift_type];
			if (from < 0 || to < 0 || !meta) return;
			if (!mine) tableRef.current?.sendGift(from, to, createSentGift(assets, meta, row.seed));
			if (!mine && to === 5 && row.sender_id !== playersRef.current[5]?.id) offerResponse(row.sender_id, row.gift_type);
			const s = profileBySeat(from), r = profileBySeat(to);
			const item = giftItems.find((i) => i.type === row.gift_type);
			pushGiftLine({
				id: row.sender_id,
				name: s?.name ?? "",
				photoUrl: s?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
			}, {
				id: row.receiver_id,
				name: r?.name ?? "",
				photoUrl: r?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
			}, (() => {
				const im = item ? dialogImage(assets, item.image, 28, 28) : null;
				return {
					type: row.gift_type,
					name: item?.name ?? row.gift_type,
					image: im?.src ?? "",
					...im ? {
						width: im.width,
						height: im.height
					} : {}
				};
			})());
		}
	}, [
		assets,
		giftItems,
		offerResponse
	]);
	const entryPrev = (0, import_react.useRef)(null);
	const entryRoom = (0, import_react.useRef)(room.roomId);
	entryRoom.current = room.roomId;
	const entryTimers = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => () => {
		entryTimers.current.forEach((timer) => window.clearTimeout(timer));
		entryTimers.current.clear();
	}, [activeTable, room.roomId]);
	(0, import_react.useEffect)(() => {
		if (!activeTable) return;
		const ids = room.players.map((p) => p?.id);
		const prev = entryPrev.current;
		entryPrev.current = {
			room: room.roomId,
			ids
		};
		const me = room.players[5]?.id;
		let fresh;
		if (!prev || prev.room !== room.roomId) fresh = me ? [me] : [];
		else fresh = joinedIds(prev.ids, ids);
		if (!fresh.length) return;
		const delay = !prev || prev.room !== room.roomId ? 900 : 0;
		(async () => {
			const sb = getSupabase();
			if (!sb) return;
			const { data } = await sb.rpc("gift_levels", { p_ids: fresh });
			for (const row of data ?? []) {
				const level = levelFromPoints(Number(row.points) || 0);
				if (level < 1) continue;
				const expected = {
					roomId: room.roomId,
					table: activeTable,
					playerId: row.id
				};
				let attempts = 0;
				const tryEntry = () => {
					const seat = displaySeatOf(row.id);
					const prof = profileBySeat(seat);
					if (!entryParticipantCurrent(expected, {
						roomId: entryRoom.current,
						table: tableRef.current,
						playerId: prof?.id
					})) return;
					if (activeTable.playEntry(seat, level, Boolean(prof?.male), () => entryRoom.current === expected.roomId && tableRef.current === expected.table)) {
						if (level >= 10) showEntryBanner(prof?.name ?? "", level);
					} else if (++attempts < 10) schedule(tryEntry, 250);
				};
				schedule(tryEntry, delay + 350);
			}
		})();
		function schedule(callback, ms) {
			const timer = window.setTimeout(() => {
				entryTimers.current.delete(timer);
				callback();
			}, ms);
			entryTimers.current.add(timer);
		}
	}, [
		activeTable,
		room.players,
		room.roomId
	]);
	(0, import_react.useEffect)(() => {
		activeTable?.setSelection(Array.from({ length: 12 }, (_, seat) => seatSelection(target, seat, 5)));
	}, [activeTable, target]);
	(0, import_react.useEffect)(() => {
		if (giftSeat === null || !assets) return;
		new Set(giftItems.flatMap((item) => [...item.gift.startSounds, ...item.gift.finishSounds])).forEach((id) => preloadSfx(assets.sfxUrl, id));
	}, [
		giftSeat,
		assets,
		giftItems
	]);
	(0, import_react.useEffect)(() => {
		if (!activeTable || !assets) return;
		for (const item of giftItems) activeTable.preloadGift(item.gift).catch(() => {});
	}, [
		activeTable,
		assets,
		giftItems
	]);
	const spent = (0, import_react.useRef)(0), localSent = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const send = (0, import_react.useCallback)((item) => {
		if (!assets) return;
		unlockSfx();
		const receivers = giftReceivers(target).map((seat) => playersRef.current[seat]?.id).filter((id) => Boolean(id));
		if (!receivers.length) return;
		const gold = (room.players[5]?.gold ?? 0) - spent.current;
		if (item.price * receivers.length > gold) {
			window.dispatchEvent(new Event(OPEN_BANK_EVENT));
			return;
		}
		const cost = item.price * receivers.length;
		spent.current += cost;
		const seed = Math.floor(Math.random() * RAND_MOD);
		const meta = assets.gifts[item.type];
		if (meta) for (const id of receivers) {
			const to = displaySeatOf(id);
			if (to >= 0) {
				localSent.current.add(`${seed}:${id}`);
				tableRef.current?.sendGift(5, to, createSentGift(assets, meta, seed));
			}
		}
		sendGift(item.type, receivers, seed).then((res) => {
			spent.current = Math.max(0, spent.current - cost);
			if (!res.ok) for (const id of receivers) localSent.current.delete(`${seed}:${id}`);
			if (res.ok) {
				window.dispatchEvent(new CustomEvent(GIFT_SENT_EVENT, { detail: item.type }));
				return;
			}
			if (res.reason.includes("insufficient")) window.dispatchEvent(new Event(OPEN_BANK_EVENT));
			else showSourceToast("Hədiyyə göndərilmədi.");
		});
	}, [
		assets,
		target,
		room.players
	]);
	const [premiumInfo, setPremiumInfo] = (0, import_react.useState)(null);
	const refreshPremium = (0, import_react.useCallback)(() => {
		premiumGiftInfo().then((info) => {
			if (info) setPremiumInfo(info);
		});
	}, []);
	const premiumItems = (0, import_react.useMemo)(() => {
		if (!assets || !premiumInfo) return [];
		return premiumInfo.gifts.flatMap((g) => {
			const live = livePremiumGift(g.type);
			if (live) return [{
				type: g.type,
				name: g.name,
				image: live.icon,
				icon: live.icon,
				price: g.dat,
				gift: {}
			}];
			const gift = assets.gifts[g.type];
			if (!gift || !gift.storeImage) return [];
			return [{
				type: g.type,
				name: g.name,
				image: gift.storeImage,
				price: g.dat,
				gift
			}];
		});
	}, [assets, premiumInfo]);
	const armed = (0, import_react.useRef)({
		type: null,
		at: 0
	});
	const premiumTap = (0, import_react.useCallback)((item) => {
		if (!assets) return;
		unlockSfx();
		const receivers = giftReceivers(target).map((seat) => playersRef.current[seat]?.id).filter((id) => Boolean(id));
		if (!receivers.length) return;
		const tap = tapPremium(armed.current, item.type, Date.now());
		armed.current = tap.next;
		if (!tap.send) {
			premiumToast(armMessage(item.name, item.price, receivers.length));
			return;
		}
		const seed = Math.floor(Math.random() * RAND_MOD);
		sendPremiumGift(item.type, receivers, seed).then((res) => {
			if (res.ok) {
				setPremiumInfo((info) => info ? {
					...info,
					dat: res.dat
				} : info);
				return;
			}
			if (res.dat !== void 0) setPremiumInfo((info) => info ? {
				...info,
				dat: res.dat
			} : info);
			premiumToast(premiumReasonText(res.reason));
		});
	}, [assets, target]);
	(0, import_react.useEffect)(() => {
		if (!assets) return;
		return onPremiumGift((row) => {
			const me = playersRef.current[5]?.id;
			const here = getRoom().roomId === row.room_id;
			premiumAnnounce(`👑 ${row.sender_name} → ${row.receiver_name}`, announceText(row));
			const live = livePremiumGift(row.gift_type);
			if (!here) playSfx(assets.sfxUrl, "boom1");
			else if (live) {
				const s = profileBySeat(displaySeatOf(row.sender_id)), r = profileBySeat(displaySeatOf(row.receiver_id));
				pushGiftLine({
					id: row.sender_id,
					name: s?.name ?? row.sender_name,
					photoUrl: s?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
				}, {
					id: row.receiver_id,
					name: r?.name ?? row.receiver_name,
					photoUrl: r?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
				}, {
					type: row.gift_type,
					name: `${row.gift_name} · 💎 ${row.dat}`,
					image: live.icon,
					width: 28,
					height: 28
				});
				playLiveGiftVideo({
					video: live.video,
					icon: live.icon,
					name: row.gift_name,
					dat: row.dat
				});
			} else {
				const from = displaySeatOf(row.sender_id), to = displaySeatOf(row.receiver_id);
				const meta = assets.gifts[row.gift_type];
				if (from >= 0 && to >= 0 && meta) tableRef.current?.sendGift(from, to, createSentGift(assets, meta, row.seed));
				playSfx(assets.sfxUrl, "boom2");
				const s = profileBySeat(from), r = profileBySeat(to);
				const im = meta ? dialogImage(assets, meta.storeImage, 28, 28) : null;
				pushGiftLine({
					id: row.sender_id,
					name: s?.name ?? row.sender_name,
					photoUrl: s?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
				}, {
					id: row.receiver_id,
					name: r?.name ?? row.receiver_name,
					photoUrl: r?.photo_url || "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K"
				}, {
					type: row.gift_type,
					name: `${row.gift_name} · 💎 ${row.dat}`,
					image: im?.src ?? "",
					...im ? {
						width: im.width,
						height: im.height
					} : {}
				});
			}
			if (me && row.receiver_id === me && row.sender_id !== me && row.reward_dat > 0) {
				datRewardPop(row.reward_dat);
				premiumToast(`🎁 ${row.sender_name} sənə ${row.gift_name} göndərdi: +${row.reward_dat} DAT`);
				setPremiumInfo((info) => info ? {
					...info,
					dat: info.dat + row.reward_dat
				} : info);
			}
		});
	}, [assets]);
	const preload = (0, import_react.useCallback)((item) => {
		const live = livePremiumGift(item.type);
		if (live) {
			preloadLiveGiftVideo(live.video);
			return;
		}
		tableRef.current?.preloadGift(item.gift).catch((error) => console.warn(`Gift preload ${item.type}`, error));
	}, []);
	const close = (0, import_react.useCallback)(() => setTarget(closedTarget), []);
	const multiselect = (0, import_react.useMemo)(() => ({
		title: assets ? translate(assets, "mobile:dlg:gift:multiselect", "Bir neçə oyunçu seç") : "",
		onSelectState: (on) => setTarget((state) => setSelective(state, on)),
		onSelectMen: () => setTarget((state) => selectGender(state, playersRef.current.map((p) => p.male), true, 5)),
		onSelectWomen: () => setTarget((state) => selectGender(state, playersRef.current.map((p) => p.male), false, 5))
	}), [assets]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: hostRef,
			className: "original-table-seats",
			"aria-label": "Masadakı oyunçular",
			children: activeTable && assets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottlePlay, {
				table: activeTable,
				assets
			}, room.roomId)
		}),
		activeTable && assets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KickoutSeatFx, {
			assets,
			seatPoint: (seat) => activeTable.seatPoint(seat)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokensBankHost, {}),
		assets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GestureDialog, {
			open: gesturesOpen,
			assets,
			account: gestureAccount,
			onClose: () => setGesturesOpen(false),
			onProfile: () => {
				setGesturesOpen(false);
				setOwnProfileOpen(true);
			},
			onPreview: async (item) => {
				const table = tableRef.current;
				if (!table) throw new Error("Table unavailable");
				await table.playGesture(5, item.gesture);
			},
			onSend: async (item) => {
				localGestures.current++;
				tableRef.current?.playGesture(5, item.gesture).catch(() => {});
				const res = await sendGesture(item.gesture.type);
				if (!res.ok) {
					localGestures.current = Math.max(0, localGestures.current - 1);
					if (res.reason.includes("insufficient")) window.dispatchEvent(new Event("source:open-tokens-bank"));
					else showSourceToast("Jest göndərilmədi.");
				}
			}
		}),
		assets && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendGiftDialog, {
			open: giftSeat !== null,
			assets,
			items: giftItems,
			receiverName: giftSeat !== null ? playersRef.current[giftSeat]?.name ?? "" : "",
			onSend: send,
			onPreload: preload,
			onClose: close,
			onLocked: setLockedGift,
			onProfile: () => {
				if (giftSeat !== null) {
					setProfileSeat(giftSeat);
					setTarget(closedTarget);
				}
			},
			selective: target.selective,
			multiselect,
			vip: progress.vip,
			premiumItems,
			dat: premiumInfo?.dat ?? null,
			onPremiumTap: premiumTap,
			onPremiumOpen: refreshPremium
		}),
		assets && response && (() => {
			const seat = displaySeatOf(response.senderId), p = playersRef.current[seat];
			if (seat < 0 || !p || p.empty) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponseGiftPopup, {
				assets,
				giftType: response.giftType,
				sender: {
					id: response.senderId,
					name: p.name,
					photoUrl: p.photoUrl,
					male: p.male
				},
				onConfirm: () => {
					endResponse({ type: "ready" });
					setGesturesOpen(false);
					setTarget((state) => openFor(state, seat, 5));
				},
				onClose: () => endResponse(closeByUser(Date.now())),
				onTimeout: () => endResponse({ type: "ready" })
			});
		})(),
		assets && profileSeat !== null && playersRef.current[profileSeat] && (() => {
			const player = playersRef.current[profileSeat];
			if (!player) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileDialog, {
				player,
				self: false,
				assets,
				onClose: () => setProfileSeat(null),
				onGift: () => {
					const seat = profileSeat;
					setProfileSeat(null);
					setTarget((state) => openFor(state, seat, 5));
				},
				onDecor: () => setProfileSeat(null),
				onMusic: () => setProfileSeat(null)
			});
		})(),
		assets && offTable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileDialog, {
			player: offTable,
			self: false,
			assets,
			onClose: () => setOffTable(null),
			onGift: () => {
				const seat = offTable.id ? displaySeatOf(offTable.id) : -1;
				if (seat < 0) return;
				setOffTable(null);
				setTarget((state) => openFor(state, seat, 5));
			},
			onDecor: () => setOffTable(null),
			onMusic: () => setOffTable(null)
		}),
		assets && ownProfileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileDialog, {
			player: {
				...playersRef.current[5] ?? {
					name: VIEWER$1.name,
					photoUrl: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX2xheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjYTZhZmIzOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNkZGU4ZWQ7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogdXJsKCNncjEyKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTQpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjZ3IxMSk7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogdXJsKCNncjEwKTsKICAgICAgfQoKICAgICAgLmNscy03IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMTcpOwogICAgICB9CgogICAgICAuY2xzLTggewogICAgICAgIGZpbGw6IHVybCgjZ3IxMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtOSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE2KTsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogdXJsKCNncjE1KTsKICAgICAgfQoKICAgICAgLmNscy0xMSB7CiAgICAgICAgZmlsbDogdXJsKCNncjE4KTsKICAgICAgfQoKICAgICAgLmNscy0xMiB7CiAgICAgICAgZmlsbDogdXJsKCNncjIpOwogICAgICB9CgogICAgICAuY2xzLTEzIHsKICAgICAgICBmaWxsOiB1cmwoI2dyNyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTQgewogICAgICAgIGZpbGw6IHVybCgjZ3I5KTsKICAgICAgfQoKICAgICAgLmNscy0xNSB7CiAgICAgICAgZmlsbDogdXJsKCNncjgpOwogICAgICB9CgogICAgICAuY2xzLTE2IHsKICAgICAgICBmaWxsOiB1cmwoI2dyMyk7CiAgICAgIH0KCiAgICAgIC5jbHMtMTcgewogICAgICAgIGZpbGw6IHVybCgjZ3I0KTsKICAgICAgfQogICAgPC9zdHlsZT4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IyIiBkYXRhLW5hbWU9ImdyMiIgeDE9IjE0OS45NSIgeTE9IjEwMjIuMjgiIHgyPSIxNDkuOTUiIHkyPSI5MDcuODQiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOThhMmE2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncjMiIGRhdGEtbmFtZT0iZ3IzIiBjeD0iMTEwLjk2IiBjeT0iNzM3LjY5IiBmeD0iMTEwLjk2IiBmeT0iNzM3LjY5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg1OC44NCAtMTQ0Ni4wOSkgcm90YXRlKDIuNjEpIHNjYWxlKDEgMi4zNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNjk2ZjczIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjQ3IiBzdG9wLWNvbG9yPSIjNzk4MDg0IiBzdG9wLW9wYWNpdHk9Ii41MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3I0IiBkYXRhLW5hbWU9ImdyNCIgY3g9Ii00MzAuMjciIGN5PSI3NjAuNDkiIGZ4PSItNDMwLjI3IiBmeT0iNzYwLjQ5IiByPSI0MS40MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAyLjA2IC0xNDc0Ljk3KSByb3RhdGUoMTc3LjM5KSBzY2FsZSgxIC0yLjM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2OTZmNzMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDciIHN0b3AtY29sb3I9IiM3OTgwODQiIHN0b3Atb3BhY2l0eT0iLjUzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjciIGRhdGEtbmFtZT0iZ3I3IiB4MT0iMTQ5LjgiIHkxPSI5NTQuNyIgeDI9IjE1My41NCIgeTI9Ijg4NC43NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzcyN2I3ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMiIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OCIgc3RvcC1jb2xvcj0iIzg1OGU5MiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44OSIgc3RvcC1jb2xvcj0iIzc3ODA4NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3MjdiN2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyOCIgZGF0YS1uYW1lPSJncjgiIHgxPSIxNTAiIHkxPSI5MzcuMTIiIHgyPSIxNTAiIHkyPSI4ODMuNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOSIgc3RvcC1jb2xvcj0iI2M1Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40MyIgc3RvcC1jb2xvcj0iI2JjYzZjYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43NiIgc3RvcC1jb2xvcj0iI2E3YjNiOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3I5IiBkYXRhLW5hbWU9ImdyOSIgeDE9IjE1MC4wNSIgeTE9Ijg3OS40NiIgeDI9IjE1MC4wNSIgeTI9IjkwNy4xMiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzk2YTFhNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNhZWJhYmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTAiIGRhdGEtbmFtZT0iZ3IxMCIgeDE9IjE0Ny43NSIgeTE9IjczMS45NCIgeDI9IjE1My40NyIgeTI9IjkzNi4wOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2M2Y2ZkMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii40OSIgc3RvcC1jb2xvcj0iI2M0Y2VkMiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2JkYzhjZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii43OCIgc3RvcC1jb2xvcj0iI2IzYzBjNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxMSIgZGF0YS1uYW1lPSJncjExIiB4MT0iMTUwIiB5MT0iMTAwNyIgeDI9IjE1MCIgeTI9Ijk1MS43NCIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UwZTllZCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmMmZiZmYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTIiIGRhdGEtbmFtZT0iZ3IxMiIgeDE9IjY0LjU1IiB5MT0iOTk3LjIzIiB4Mj0iNjQuNTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjEzIiBkYXRhLW5hbWU9ImdyMTMiIHgxPSI5Mi43IiB5MT0iOTk3LjIzIiB4Mj0iOTIuNyIgeTI9Ijk2My4zMSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIC03MjIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzgzOGI4ZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzg4OTA5NCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4Zjk4OWMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyMTQiIGRhdGEtbmFtZT0iZ3IxNCIgeDE9IjEyOS4xIiB5MT0iOTk3LjIzIiB4Mj0iMTI5LjEiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE1IiBkYXRhLW5hbWU9ImdyMTUiIHgxPSIxNTQuMTUiIHkxPSI5OTcuMjMiIHgyPSIxNTQuMTUiIHkyPSI5NjMuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtNzIyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MzhiOGYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTciIHN0b3AtY29sb3I9IiM4ODkwOTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOGY5ODljIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncjE2IiBkYXRhLW5hbWU9ImdyMTYiIHgxPSIxODIuMyIgeTE9Ijk5Ny4yMyIgeDI9IjE4Mi4zIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxNyIgZGF0YS1uYW1lPSJncjE3IiB4MT0iMjA3Ljk1IiB5MT0iOTk3LjIzIiB4Mj0iMjA3Ljk1IiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3IxOCIgZGF0YS1uYW1lPSJncjE4IiB4MT0iMjMzIiB5MT0iOTk3LjIzIiB4Mj0iMjMzIiB5Mj0iOTYzLjMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTcyMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjODM4YjhmIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjU3IiBzdG9wLWNvbG9yPSIjODg5MDk0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhmOTg5YyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMCwzMDBWMGgzMDB2MzAwSDBaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xMiIgZD0ibTE5Ni43LDE4Ni4yaC05My40Yy0xLjguNS04MC43LDIzLjktODAuNyw4MS43djMyLjFoMjU0Ljd2LTMyLjFjLjEtNTcuOC03OC44LTgxLjItODAuNi04MS43WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTYiIGQ9Im04MS42LDIzMy41bC01NS41LDIwYzEsMTguNywyLjYsNDYuNSwyLjYsNDYuNWg1MC43YzEuMi01LjQsMS45LTE0LDEtMjMtMS45LTE5LDEuMi00My41LDEuMi00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Im0yMTguMywyMzMuNWw1NS42LDIwYy0xLDE4LjctMi42LDQ2LjUtMi42LDQ2LjVoLTUwLjdjLTEuMi01LjQtMS45LTE0LTEtMjMsMS44LTE5LTEuMy00My41LTEuMy00My41WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE4Mi4xLDE4MC45Yy0yLjQsMTUuNi0xNS44LDI3LjYtMzIuMSwyNy42cy0yOS43LTEyLTMyLjEtMjcuNmwtMTUuNiw3YzQuNiwyMi4xLDI0LjIsMzYuNyw0Ny43LDM2LjdzNDMuMS0xNC42LDQ3LjctMzYuN2wtMTUuNi03WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTMiIGQ9Im0yMTMuNiwyMjkuOGgtNi4zYzAtMzEuOC0yNi44LTU5LjgtNTcuMy01OS44cy01Ny4zLDI4LTU3LjMsNTkuOGgtNi4zYzAtMzUuMiwyOS43LTY2LjEsNjMuNi02Ni4xczYzLjYsMzAuOSw2My42LDY2LjFaIi8+CiAgPHBhdGggY2xhc3M9ImNscy0xNSIgZD0ibTE1MCwyMDguNWMxNi4yLDAsMjkuNy0xMiwzMi4xLTI3LjZsLTIuNy0yNS44aC01OC44bC0yLjcsMjUuOGMyLjQsMTUuNiwxNS45LDI3LjYsMzIuMSwyNy42WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMTQiIGQ9Im0xMjAuNiwxNTUuMWwtMS42LDE2LjNjOS4xLDUuMSwxNi41LDEwLjMsMzEsMTAuM3MyMi01LjIsMzEuMS0xMC4zbC0xLjctMTYuM2gtNTguOFoiLz4KICA8cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Im0yMDYuMSw1OC42Yy05LjItMjkuMy0zNC43LTM2LjktNTYuMS0zNi45cy00Ni45LDcuNi01Ni4xLDM2LjljLTkuMiwyOS4zLTcuOSwxMTQuOCw1Ni4xLDExNC44czY1LjQtODUuNSw1Ni4xLTExNC44WiIvPgogIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0ibTI1MSwyODVINDljLTQuNywwLTguNC0zLjgtOC40LTguNHYtMzguNGMwLTQuNywzLjgtOC40LDguNC04LjRoMjAyYzQuNywwLDguNCwzLjgsOC40LDguNHYzOC40Yy4xLDQuNy0zLjcsOC40LTguNCw4LjRaIi8+Cgo8L3N2Zz4K",
					frame: "",
					stone: "",
					male: VIEWER$1.male
				},
				age: VIEWER$1.age
			},
			self: true,
			assets,
			onClose: () => setOwnProfileOpen(false),
			onGift: () => setOwnProfileOpen(false),
			onDecor: () => {
				setOwnProfileOpen(false);
				window.dispatchEvent(new CustomEvent("source:open-decor"));
			},
			onMusic: () => {
				setOwnProfileOpen(false);
				window.dispatchEvent(new CustomEvent("source:open-music-list"));
			}
		}),
		assets && lockedGift?.lock && (() => {
			const t = (key) => translate(assets, key);
			const vip = lockedGift.lock.kind === "vip";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceGiftLockedDialog, {
				kind: "gift",
				image: dialogImage(assets, lockedGift.image, 60, 60),
				title: vip ? t("dlg:locked:vip:title") : t("dlg:locked_gift:title"),
				description: vip ? t("dlg:locked_gift:vip:desc") : t("dlg:locked:kiss:desc"),
				...lockedGift.lock.kind === "kisses" ? { lock: {
					type: "kisses",
					needed: lockedGift.lock.need,
					current: progress.kisses
				} } : {},
				onClose: () => setLockedGift(null),
				cancel: {
					title: t("dlg:navigate_vip:btn"),
					onClick: () => setLockedGift(null)
				},
				info: {
					title: t("mobile:vip:know"),
					onClick: () => {
						setLockedGift(null);
						setTarget(closedTarget);
						window.dispatchEvent(new CustomEvent(vip ? "source:open-vip" : "source:open-tops", { detail: "total_kisses" }));
					}
				}
			});
		})()
	] });
}
function buildPlayers(assets, profiles, frame, stone) {
	return Array.from({ length: 12 }, (_, seat) => {
		const p = profiles[seat];
		if (!p) return {
			name: "",
			photoUrl: DEFAULT_PHOTO,
			frame: "",
			stone: "",
			male: seat % 2 === 1,
			empty: true
		};
		const own = seat === 5;
		const f = own ? frame : p.frame, st = own ? stone : p.stone;
		return {
			id: p.id,
			name: p.name,
			photoUrl: playerPhoto(p.photo_url, p.telegram_id),
			frame: assets.frames[f] ? f : "",
			stone: assets.stones[st] ? st : "",
			male: p.male,
			isNew: false,
			...p.age ? { age: p.age } : {},
			...p.city ? { city: p.city } : {},
			zodiac: telegramZodiac(p.birthday),
			...p.vip_until && Date.parse(p.vip_until) > Date.now() ? { vipUntil: Date.parse(p.vip_until) } : {},
			kisses: p.table_kisses ?? 0
		};
	});
}
/** ureyimsen Ud.banner: top banner for gift level >= 10, 3.4s. */
function showEntryBanner(name, level) {
	const t = tier(level);
	const el = document.createElement("div");
	el.className = `glv-entry glv-entry--t${t.i}`;
	el.style.setProperty("--glv-c1", t.c1);
	el.style.setProperty("--glv-c2", t.c2);
	el.style.setProperty("--glv-rim", t.rim);
	const badge = document.createElement("img");
	badge.className = "glv-entry__badge";
	badge.src = entryBadge(level);
	badge.alt = `Lv ${level}`;
	const text = document.createElement("div");
	text.className = "glv-entry__text";
	const n = document.createElement("div");
	n.className = "glv-entry__name";
	n.textContent = name;
	const sub = document.createElement("div");
	sub.className = "glv-entry__sub";
	sub.textContent = `${t.name} · masaya daxil oldu`;
	text.append(n, sub);
	el.append(badge, text);
	document.body.appendChild(el);
	window.setTimeout(() => el.remove(), 3400);
}
var ui_loading_pattern_default = "/assets/ui_loading_pattern-BomelKAF.svg";
var loadingPatternFallback = "data:image/svg+xml,%3Csvg%20version%3D%221.1%22%0A%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20%20%20%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%0A%20%20%20%20%20width%3D%221600%22%20height%3D%221600%22%20viewBox%3D%220%200%201600%201600%22%3E%0A%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cstyle%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20.cls-1%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20opacity%3A0.65%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%2386b74f%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20.cls-2%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20opacity%3A0.65%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%2382ac51%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22dot0%22%20viewBox%3D%220%200%2024%2024%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M24%2C11.94a11.48%2C11.48%2C0%2C0%2C0-3.54-8.41A11.48%2C11.48%2C0%2C0%2C0%2C12.06%2C0%2C11.61%2C11.61%2C0%2C0%2C0%2C3.54%2C3.54%2C11.48%2C11.48%2C0%2C0%2C0%2C0%2C11.94a11.61%2C11.61%2C0%2C0%2C0%2C3.54%2C8.52A11.61%2C11.61%2C0%2C0%2C0%2C12.06%2C24a11.48%2C11.48%2C0%2C0%2C0%2C8.41-3.54A11.61%2C11.61%2C0%2C0%2C0%2C24%2C11.94Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22dot1%22%20viewBox%3D%220%200%2032%2032%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M0%2C16A15.5%2C15.5%2C0%2C0%2C0%2C4.74%2C27.36%2C15.33%2C15.33%2C0%2C0%2C0%2C16%2C32a15.45%2C15.45%2C0%2C0%2C0%2C11.36-4.64A15.45%2C15.45%2C0%2C0%2C0%2C32%2C16%2C15.33%2C15.33%2C0%2C0%2C0%2C27.36%2C4.74%2C15.49%2C15.49%2C0%2C0%2C0%2C16%2C0%2C15.17%2C15.17%2C0%2C0%2C0%2C4.74%2C4.74%2C15.17%2C15.17%2C0%2C0%2C0%2C0%2C16Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22dot2%22%20viewBox%3D%220%200%2044%2044%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M37.57%2C6.43A21.19%2C21.19%2C0%2C0%2C0%2C22%2C0%2C21%2C21%2C0%2C0%2C0%2C6.53%2C6.43l-.1.1A21%2C21%2C0%2C0%2C0%2C0%2C22%2C21.19%2C21.19%2C0%2C0%2C0%2C6.43%2C37.57%2C21.25%2C21.25%2C0%2C0%2C0%2C22%2C44a21.47%2C21.47%2C0%2C0%2C0%2C15.57-6.33l.1-.1A21.47%2C21.47%2C0%2C0%2C0%2C44%2C22%2C21.25%2C21.25%2C0%2C0%2C0%2C37.57%2C6.43M29%2C15a9.54%2C9.54%2C0%2C0%2C1%2C2.91%2C7%2C9.83%2C9.83%2C0%2C0%2C1-2.81%2C7l-.1.1a9.83%2C9.83%2C0%2C0%2C1-7%2C2.81A9.54%2C9.54%2C0%2C0%2C1%2C15%2C29a9.6%2C9.6%2C0%2C0%2C1-2.91-7A9.31%2C9.31%2C0%2C0%2C1%2C15%2C15.07l.1-.1A9.31%2C9.31%2C0%2C0%2C1%2C22%2C12.05%2C9.6%2C9.6%2C0%2C0%2C1%2C29%2C15Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22dot3%22%20viewBox%3D%220%200%2060%2060%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M51.14%2C8.77h0A28.68%2C28.68%2C0%2C0%2C0%2C30.05%2C0%2C29.18%2C29.18%2C0%2C0%2C0%2C8.75%2C8.77h.11A28.81%2C28.81%2C0%2C0%2C0%2C0%2C30%2C28.94%2C28.94%2C0%2C0%2C0%2C8.22%2C50.7l.53.53.11.11A29.07%2C29.07%2C0%2C0%2C0%2C30.05%2C60a28.91%2C28.91%2C0%2C0%2C0%2C21.09-8.66v-.11h0A28.77%2C28.77%2C0%2C0%2C0%2C60%2C30%2C28.81%2C28.81%2C0%2C0%2C0%2C51.14%2C8.77m-9%2C9%2C.11.11A16.38%2C16.38%2C0%2C0%2C1%2C47.35%2C30a16.54%2C16.54%2C0%2C0%2C1-5.17%2C12.25h.11a16.72%2C16.72%2C0%2C0%2C1-12.23%2C5.07%2C16.81%2C16.81%2C0%2C0%2C1-12.34-5.07h0A16.71%2C16.71%2C0%2C0%2C1%2C12.65%2C30a16.38%2C16.38%2C0%2C0%2C1%2C5.06-12.15v-.11a17%2C17%2C0%2C0%2C1%2C12.34-5.07A16.56%2C16.56%2C0%2C0%2C1%2C42.18%2C17.75Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22dot4%22%20viewBox%3D%220%200%2084%2084%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-1%22%20d%3D%22M71.72%2C12.19h0A40.77%2C40.77%2C0%2C0%2C0%2C42%2C0%2C40.63%2C40.63%2C0%2C0%2C0%2C12.38%2C12.19h-.1A40.76%2C40.76%2C0%2C0%2C0%2C0%2C41.95%2C40.56%2C40.56%2C0%2C0%2C0%2C12.28%2C71.7h.1A40.46%2C40.46%2C0%2C0%2C0%2C42%2C84%2C40.6%2C40.6%2C0%2C0%2C0%2C71.72%2C71.7h0A40.69%2C40.69%2C0%2C0%2C0%2C84%2C41.95%2C40.56%2C40.56%2C0%2C0%2C0%2C71.72%2C12.29v-.1M62.95%2C21h.1a29%2C29%2C0%2C0%2C1%2C8.57%2C21%2C28.71%2C28.71%2C0%2C0%2C1-8.57%2C21l-.1.1A28.64%2C28.64%2C0%2C0%2C1%2C42%2C71.6a28.62%2C28.62%2C0%2C0%2C1-20.95-8.68h0a28.59%2C28.59%2C0%2C0%2C1-8.67-21%2C28.83%2C28.83%2C0%2C0%2C1%2C8.67-21h0A28.8%2C28.8%2C0%2C0%2C1%2C42%2C12.4%2C28.63%2C28.63%2C0%2C0%2C1%2C62.95%2C21Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22bottle%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-2%22%20d%3D%22M4.5%2C94.8a15.69%2C15.69%2C0%2C0%2C0%2C0%2C22l38%2C37.85a15.45%2C15.45%2C0%2C0%2C0%2C22%2C0L116.1%2C103a36.68%2C36.68%2C0%2C0%2C0%2C8.65-38.15L139%2C50.5a14.94%2C14.94%2C0%2C0%2C0%2C6.65-4l7.9-8a15.24%2C15.24%2C0%2C0%2C0%2C4.5-11%2C15.6%2C15.6%2C0%2C0%2C0-4.6-11.05L141.65%2C4.6A15.13%2C15.13%2C0%2C0%2C0%2C130.55%2C0%2C14.82%2C14.82%2C0%2C0%2C0%2C119.4%2C4.7l-7.9%2C7.9a14.74%2C14.74%2C0%2C0%2C0-3.8%2C7.05L93.25%2C34.1A34.42%2C34.42%2C0%2C0%2C0%2C82.2%2C32.35a35.84%2C35.84%2C0%2C0%2C0-14%2C2.8%2C37%2C37%2C0%2C0%2C0-11.9%2C8L4.5%2C94.8m9.35%2C12.7a2.55%2C2.55%2C0%2C0%2C1%2C0-3.4L65.6%2C52.45A23.36%2C23.36%2C0%2C0%2C1%2C95.2%2C49.6L96%2C50l24.8-24.7-.2-.6a2.5%2C2.5%2C0%2C0%2C1%2C.4-2.8L129%2C14a2%2C2%2C0%2C0%2C1%2C1.6-.75%2C2.29%2C2.29%2C0%2C0%2C1%2C1.75.75L144.1%2C25.7a2.66%2C2.66%2C0%2C0%2C1%2C0%2C3.6l-7.9%2C8a2.35%2C2.35%2C0%2C0%2C1-1.4.7l-1.65-.3L108.85%2C62v.8l.2.3a23%2C23%2C0%2C0%2C1%2C4.5%2C15.7%2C22.55%2C22.55%2C0%2C0%2C1-6.75%2C14.85L55.15%2C145.3a2.48%2C2.48%2C0%2C0%2C1-1.75.7%2C2.26%2C2.26%2C0%2C0%2C1-1.65-.7Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22crown%22%20viewBox%3D%220%200%20156%20148%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-2%22%20d%3D%22M.59%2C79.76a21.24%2C21.24%2C0%2C0%2C0%2C3%2C16.84%2C22.35%2C22.35%2C0%2C0%2C0%2C10.55%2C8.75%2C21.69%2C21.69%2C0%2C0%2C0%2C12.73%2C1.16l30.53%2C25.82%2C6%2C9.31a11.9%2C11.9%2C0%2C0%2C0%2C16.44%2C3.66l70.6-45a11.76%2C11.76%2C0%2C0%2C0%2C5.18-7.2%2C11.2%2C11.2%2C0%2C0%2C0-1.3-8.78h-.1l-4.62-7.89L138.29%2C35.31a21.37%2C21.37%2C0%2C0%2C0%2C4.13-11.87%2C22%2C22%2C0%2C0%2C0-3.57-13A21.59%2C21.59%2C0%2C0%2C0%2C124.91.58a21.22%2C21.22%2C0%2C0%2C0-16.89%2C3%2C21.53%2C21.53%2C0%2C0%2C0-9.8%2C14%2C20.85%2C20.85%2C0%2C0%2C0%2C2.89%2C16.79l.09.15%2C1.7%2C2.18L100%2C46.06%2C80.58%2C32.32a22.33%2C22.33%2C0%2C0%2C0-3.5-11.63A21.85%2C21.85%2C0%2C0%2C0%2C63.13%2C10.9a21.3%2C21.3%2C0%2C0%2C0-16.94%2C3%2C21.59%2C21.59%2C0%2C0%2C0-9.75%2C14%2C20.44%2C20.44%2C0%2C0%2C0%2C2.9%2C16.69%2C22%2C22%2C0%2C0%2C0%2C9.19%2C8.22l4.13%2C23.29-10.15-1.4a13.19%2C13.19%2C0%2C0%2C0-1.25-2.2%2C21.85%2C21.85%2C0%2C0%2C0-13.94-9.84%2C21%2C21%2C0%2C0%2C0-16.84%2C3%2C21.65%2C21.65%2C0%2C0%2C0-9.89%2C14m13.84%2C9.88a9.48%2C9.48%2C0%2C0%2C1-1.15-7.09%2C9%2C9%2C0%2C0%2C1%2C4.07-6%2C9.54%2C9.54%2C0%2C0%2C1%2C7.19-1.2%2C9.17%2C9.17%2C0%2C0%2C1%2C5.89%2C4.06%2C9.41%2C9.41%2C0%2C0%2C1%2C1.43%2C5.82l-.05.89%2C36.7%2C5.43L59.72%2C42l-.89%2C0A8.74%2C8.74%2C0%2C0%2C1%2C54%2C41.15a8.42%2C8.42%2C0%2C0%2C1-3.7-3.44%2C9.26%2C9.26%2C0%2C0%2C1%2C2.86-12.93%2C9.14%2C9.14%2C0%2C0%2C1%2C7.1-1.3%2C9%2C9%2C0%2C0%2C1%2C5.88%2C4.16%2C11.17%2C11.17%2C0%2C0%2C1%2C1.54%2C4.79%2C9.19%2C9.19%2C0%2C0%2C1-1.23%2C4.77L66%2C38l41.26%2C29%2C10.58-35.31L117%2C31.4a9.76%2C9.76%2C0%2C0%2C1-4.91-3.91%2C9%2C9%2C0%2C0%2C1-1.25-7.1A9.19%2C9.19%2C0%2C0%2C1%2C115%2C14.47a9.54%2C9.54%2C0%2C0%2C1%2C7.19-1.2A8.77%2C8.77%2C0%2C0%2C1%2C128%2C17.33a9.54%2C9.54%2C0%2C0%2C1%2C1.2%2C7.19%2C9.12%2C9.12%2C0%2C0%2C1-4.06%2C5.89l-1.33.71%2C13.58%2C50.27.09.1%2C5.22%2C8.57L73.76%2C133.82l-6.42-10-.19-.21L29.11%2C91.32l-1.6%2C1.19a9.14%2C9.14%2C0%2C0%2C1-7.1%2C1.3A9.07%2C9.07%2C0%2C0%2C1%2C14.43%2C89.65Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22gift%22%20viewBox%3D%220%200%20136%20149%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-2%22%20d%3D%22M133.25%2C67.07a17%2C17%2C0%2C0%2C0-10.68-8.2l-5.11-1.37a25.48%2C25.48%2C0%2C0%2C0%2C8.7-13.56%2C25.24%2C25.24%2C0%2C0%2C0-2.62-19.88%2C26.2%2C26.2%2C0%2C0%2C0-35.79-9.59l-3.18%2C2.16-1.68-3.46A25.24%2C25.24%2C0%2C0%2C0%2C67%2C1%2C25.24%2C25.24%2C0%2C0%2C0%2C47.1%2C3.58%2C25.31%2C25.31%2C0%2C0%2C0%2C34.77%2C19.45a25.4%2C25.4%2C0%2C0%2C0%2C.88%2C16.13l-5.11-1.37A17%2C17%2C0%2C0%2C0%2C17.19%2C36%2C17%2C17%2C0%2C0%2C0%2C9%2C46.65L4.77%2C62.37a11.61%2C11.61%2C0%2C0%2C0%2C.45%2C7.52%2C12.41%2C12.41%2C0%2C0%2C0%2C4.66%2C5.63L.43%2C110.8a10.92%2C10.92%2C0%2C0%2C0%2C1.2%2C8.81%2C10.92%2C10.92%2C0%2C0%2C0%2C7%2C5.45l87.43%2C23.42a11.75%2C11.75%2C0%2C0%2C0%2C14.26-8.23L119.8%2C105a12%2C12%2C0%2C0%2C0%2C11-8.83L135%2C80.42a17%2C17%2C0%2C0%2C0-1.77-13.35M119%2C72a4.07%2C4.07%2C0%2C0%2C1%2C2.81%2C4.86l-3.7%2C13.8L74.82%2C79.09l4.73-17.64L119%2C72M104.1%2C25a12.25%2C12.25%2C0%2C0%2C1%2C7.73%2C5.91%2C12.1%2C12.1%2C0%2C0%2C1%2C1.28%2C9.52%2C12.25%2C12.25%2C0%2C0%2C1-5.91%2C7.73%2C22%2C22%2C0%2C0%2C1-5.88%2C2q-7.42%2C2.12-25.06-2.6t-23-10.27a22%2C22%2C0%2C0%2C1-4.09-4.66A12.25%2C12.25%2C0%2C0%2C1%2C47.93%2C23a12.1%2C12.1%2C0%2C0%2C1%2C5.87-7.6%2C12.25%2C12.25%2C0%2C0%2C1%2C9.65-1.25A12.1%2C12.1%2C0%2C0%2C1%2C71.06%2C20a20.11%2C20.11%2C0%2C0%2C1%2C2.49%2C10.12%2C6.93%2C6.93%2C0%2C0%2C0%2C1.56%2C4.39%2C7.68%2C7.68%2C0%2C0%2C0%2C8.69%2C2.33%2C6.93%2C6.93%2C0%2C0%2C0%2C3.55-3%2C20.11%2C20.11%2C0%2C0%2C1%2C7.22-7.52A12.1%2C12.1%2C0%2C0%2C1%2C104.1%2C25m-82%2C25.17A3.54%2C3.54%2C0%2C0%2C1%2C24%2C47.8a3.54%2C3.54%2C0%2C0%2C1%2C3-.43L66.51%2C58%2C61.78%2C75.59%2C18.45%2C64l3.7-13.8m-8%2C62.23L23%2C79.31l35.28%2C9.45-8.87%2C33.1-35.28-9.45m92.46-10.71-8.87%2C33.1-35.28-9.45%2C8.87-33.1Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22heart%22%20viewBox%3D%220%200%20125%20116%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-2%22%20d%3D%22M124%2C43.78q-.37-16.63-8.59-27.49A40%2C40%2C0%2C0%2C0%2C94.74%2C1.49Q80.62-2.71%2C67%2C4.91A37.87%2C37.87%2C0%2C0%2C0%2C51.11%2C21.19a52.6%2C52.6%2C0%2C0%2C0-2.7%2C6.8%2C48.88%2C48.88%2C0%2C0%2C0-7.19-1.31A37.52%2C37.52%2C0%2C0%2C0%2C19%2C31.38v0Q5.3%2C39%2C1.44%2C53.16a39.39%2C39.39%2C0%2C0%2C0%2C1.48%2C25.4q4.87%2C12.78%2C18.62%2C22t33.22%2C12.62h0q25.93%2C4.58%2C37.91%2C1.59h0a9.87%2C9.87%2C0%2C0%2C0%2C3-1.12l.05%2C0%2C.22-.27a10.6%2C10.6%2C0%2C0%2C0%2C2.36-1.53v0q8.94-8.45%2C18.73-33v0q7.31-18.4%2C6.94-34.92m-12.27.83q.33%2C13.7-6.1%2C29.5Q97.05%2C95.5%2C89.9%2C102.7l-.3.07-.11.14Q79.41%2C105.11%2C57%2C101h0q-16.71-2.9-28.23-10.4Q17.9%2C83.43%2C14.28%2C74.09q-4.09-10.71-.44-19.65a24.11%2C24.11%2C0%2C0%2C1%2C11-12.21%2C25.35%2C25.35%2C0%2C0%2C1%2C15.07-3.3%2C35.18%2C35.18%2C0%2C0%2C1%2C18.37%2C7.84l1%2C.73-.17-1.2a33.83%2C33.83%2C0%2C0%2C1%2C3.1-19.68%2C26%2C26%2C0%2C0%2C1%2C10.73-11%2C24.25%2C24.25%2C0%2C0%2C1%2C16.25-2.89h0q9.54%2C1.64%2C16.4%2C10.88v0Q111.63%2C31.67%2C111.74%2C44.61Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22lips%22%20viewBox%3D%220%200%20144%20115%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-2%22%20d%3D%22M13.94%2C16Q4%2C20.66%2C1.42%2C26.61q-4.36%2C9.39%2C4.65%2C33%2C9.47%2C24.91%2C24.8%2C38%2C6.1%2C5.37%2C22%2C11.3%2C13.48%2C5%2C21.44%2C5.43%2C20.38%2C1.33%2C44.14-12.28a108.23%2C108.23%2C0%2C0%2C0%2C12.44-8.39v.1q10.24-8%2C12.08-14t-2.4-16.17q-4-9.06-18.26-33.52l-1.12-1.92q-7-12.14-18.61-16.28a33.54%2C33.54%2C0%2C0%2C0-14.43-2A33.85%2C33.85%2C0%2C0%2C0%2C75.88%2C2q-11.21-4.16-24%2C.18l-2.19.7Q22.51%2C11.93%2C13.94%2C16m4.26%2C39q-7-18.52-5.06-23%2C1.35-2.69%2C14.75-7.84Q35.12%2C21.24%2C56%2C14.37q8.54-2.9%2C15.51-.29a21.93%2C21.93%2C0%2C0%2C1%2C8.4%2C5.77%2C17.81%2C17.81%2C0%2C0%2C1%2C2.71%2C3.52l.54%2C1%2C1-.73%2C4.35-.87a20.3%2C20.3%2C0%2C0%2C1%2C9.69%2C1.15q7.26%2C2.69%2C11.86%2C10.66%2C11%2C18.69%2C14.69%2C25.78Q131.2%2C73.1%2C130.54%2C76q-1.7%2C5.13-18.56%2C14.87-20.2%2C11.53-36.84%2C10.57H75q-6.12-.48-17.76-4.62-13.58-5-18-8.91Q26.42%2C76.77%2C18.19%2C55m39.64-7.15a97.9%2C97.9%2C0%2C0%2C0-10.38-3.19%2C8.78%2C8.78%2C0%2C0%2C0-3.31-.44q-2%2C.11-2.24%2C1.43v-.1q-1.43%2C3%2C7.17%2C9.71A75.85%2C75.85%2C0%2C0%2C0%2C69.25%2C66.16a70.73%2C70.73%2C0%2C0%2C0%2C22.61%2C4.74q10.81.51%2C11.65-2.63%2C1-2-3.68-4.39a81.09%2C81.09%2C0%2C0%2C0-9.9-4.14Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Csymbol%20id%3D%22sound%22%20viewBox%3D%220%200%20136%20151%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20class%3D%22cls-2%22%20d%3D%22M136%2C20.05q.44-9-5.07-14.73A17.46%2C17.46%2C0%2C0%2C0%2C117.73%2C0l-4%2C.3h-.2l-.1.1L51%2C15.67v-.1A23.43%2C23.43%2C0%2C0%2C0%2C38.86%2C22a20.21%2C20.21%2C0%2C0%2C0-6.4%2C13.7V84A31.89%2C31.89%2C0%2C0%2C0%2C9.7%2C93.8a33.36%2C33.36%2C0%2C0%2C0%2C.1%2C47.15%2C32.06%2C32.06%2C0%2C0%2C0%2C23.55%2C9.7%2C32.48%2C32.48%2C0%2C0%2C0%2C22.86-9%2C31.36%2C31.36%2C0%2C0%2C0%2C10.44-21.87l.1-58.62%2C35-7.93V67.84a32%2C32%2C0%2C0%2C0-22.66%2C9.85%2C33.07%2C33.07%2C0%2C0%2C0%2C0%2C47.1%2C33.57%2C33.57%2C0%2C0%2C0%2C46.5.69%2C31.19%2C31.19%2C0%2C0%2C0%2C10.29-22l.1-83.4m-14.24-5.52v.1A7.24%2C7.24%2C0%2C0%2C1%2C123%2C19.85l-.1%2C83a19%2C19%2C0%2C0%2C1-6.3%2C13.15%2C20.4%2C20.4%2C0%2C0%2C1-34.48-14.73%2C20.35%2C20.35%2C0%2C0%2C1%2C20.34-20.44q6.8%2C0%2C10.49%2C3.1l1.63%2C1.28V37.1L53.79%2C50.84l-.1%2C68.23a18.7%2C18.7%2C0%2C0%2C1-6.3%2C13.05%2C20%2C20%2C0%2C0%2C1-14%2C5.57%2C19.63%2C19.63%2C0%2C0%2C1-14.43-5.91%2C20.46%2C20.46%2C0%2C0%2C1-.1-28.87%2C19.83%2C19.83%2C0%2C0%2C1%2C20.24-5.07A13.74%2C13.74%2C0%2C0%2C1%2C43.79%2C100l1.58%2C1.23V36.41a7.93%2C7.93%2C0%2C0%2C1%2C4.24-6.55%2C13.45%2C13.45%2C0%2C0%2C1%2C4.09-1.58h.1L115.9%2C13.15a7.19%2C7.19%2C0%2C0%2C1%2C1.82-.2%2C4.84%2C4.84%2C0%2C0%2C1%2C4%2C1.58M39.95%2C110.84a9.14%2C9.14%2C0%2C0%2C0-6.7-2.81%2C9.43%2C9.43%2C0%2C0%2C0%2C0%2C18.87%2C9.14%2C9.14%2C0%2C0%2C0%2C6.7-2.81%2C9.46%2C9.46%2C0%2C0%2C0%2C0-13.25m69-16.21a9.39%2C9.39%2C0%2C0%2C0-13.35%2C13.2%2C9.58%2C9.58%2C0%2C0%2C0%2C13.35%2C0%2C9.4%2C9.4%2C0%2C0%2C0%2C0-13.2Z%22%2F%3E%0A%20%20%20%20%3C%2Fsymbol%3E%0A%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22136%22%20y%3D%22997%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22118%22%20y%3D%221332%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%223%22%20y%3D%221099%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22-152%22%20y%3D%221177%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22145%22%20y%3D%221186%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22-118%22%20y%3D%221395%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22-140%22%20y%3D%221049%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22-17%22%20y%3D%22934%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%2265%22%20y%3D%22832%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22-24%22%20y%3D%221267%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22136%22%20y%3D%22369%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22118%22%20y%3D%22704%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%223%22%20y%3D%22471%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22-152%22%20y%3D%22549%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22145%22%20y%3D%22558%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22-118%22%20y%3D%22767%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22-140%22%20y%3D%22421%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22-17%22%20y%3D%22306%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%2265%22%20y%3D%22204%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22-24%22%20y%3D%22639%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22118%22%20y%3D%2280%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%223%22%20y%3D%22-153%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22-152%22%20y%3D%22-75%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22145%22%20y%3D%22-66%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22-118%22%20y%3D%22142%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22-24%22%20y%3D%2214%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22810%22%20y%3D%221219%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22852%22%20y%3D%221475%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22532%22%20y%3D%221485%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22326%22%20y%3D%221142%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221305%22%20y%3D%221315%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22378%22%20y%3D%221456%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22649%22%20y%3D%221255%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221287%22%20y%3D%221651%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22762%22%20y%3D%221610%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22429%22%20y%3D%221621%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22234%22%20y%3D%221423%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22922%22%20y%3D%221600%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22594%22%20y%3D%221632%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221172%22%20y%3D%221418%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22418%22%20y%3D%221291%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22511%22%20y%3D%221143%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22675%22%20y%3D%221491%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221016%22%20y%3D%221496%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221314%22%20y%3D%221504%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22254%22%20y%3D%221580%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22257%22%20y%3D%221280%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22875%22%20y%3D%221343%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22740%22%20y%3D%221350%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221028%22%20y%3D%221367%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22564%22%20y%3D%221360%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221151%22%20y%3D%221252%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221234%22%20y%3D%221151%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22962%22%20y%3D%221249%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%221144%22%20y%3D%221585%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22681%22%20y%3D%221112%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22810%22%20y%3D%22591%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22852%22%20y%3D%22847%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22532%22%20y%3D%22857%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22326%22%20y%3D%22514%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221305%22%20y%3D%22687%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22888%22%20y%3D%221109%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22378%22%20y%3D%22828%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22649%22%20y%3D%22627%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221287%22%20y%3D%221023%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22762%22%20y%3D%22982%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22429%22%20y%3D%22993%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22234%22%20y%3D%22795%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22922%22%20y%3D%22972%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22594%22%20y%3D%221004%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221172%22%20y%3D%22790%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22418%22%20y%3D%22663%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22511%22%20y%3D%22515%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22675%22%20y%3D%22863%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221016%22%20y%3D%22868%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221314%22%20y%3D%22876%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22254%22%20y%3D%22952%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221050%22%20y%3D%221085%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22257%22%20y%3D%22652%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22875%22%20y%3D%22715%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22740%22%20y%3D%22722%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221028%22%20y%3D%22739%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22564%22%20y%3D%22732%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221151%22%20y%3D%22624%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221234%22%20y%3D%22523%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22962%22%20y%3D%22621%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%221144%22%20y%3D%22957%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22681%22%20y%3D%22484%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22810%22%20y%3D%22-33%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22852%22%20y%3D%22222%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22532%22%20y%3D%22232%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%22326%22%20y%3D%22-110%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221305%22%20y%3D%2262%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22888%22%20y%3D%22484%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22378%22%20y%3D%22203%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22649%22%20y%3D%222%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221287%22%20y%3D%22398%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22762%22%20y%3D%22357%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22429%22%20y%3D%22368%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22234%22%20y%3D%22170%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22922%22%20y%3D%22347%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22594%22%20y%3D%22380%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221172%22%20y%3D%22165%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22418%22%20y%3D%2238%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22511%22%20y%3D%22-109%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22675%22%20y%3D%22238%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221016%22%20y%3D%22243%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221314%22%20y%3D%22252%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22254%22%20y%3D%22327%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221050%22%20y%3D%22461%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22257%22%20y%3D%2227%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22875%22%20y%3D%2290%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%22740%22%20y%3D%2297%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221028%22%20y%3D%22114%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22564%22%20y%3D%22107%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221151%22%20y%3D%220%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%221234%22%20y%3D%22-101%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%22962%22%20y%3D%22-2%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%221144%22%20y%3D%22332%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%22681%22%20y%3D%22-139%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22888%22%20y%3D%22-143%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%221494%22%20y%3D%221460%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221587%22%20y%3D%221609%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221425%22%20y%3D%221599%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%221494%22%20y%3D%22832%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221547%22%20y%3D%221146%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221597%22%20y%3D%221311%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221403%22%20y%3D%221113%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221587%22%20y%3D%22981%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221423%22%20y%3D%221270%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221425%22%20y%3D%22971%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23bottle%22%20x%3D%221494%22%20y%3D%22207%22%20width%3D%2276%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221547%22%20y%3D%22521%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221597%22%20y%3D%22686%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221403%22%20y%3D%22488%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221587%22%20y%3D%22357%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221423%22%20y%3D%22645%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221425%22%20y%3D%22346%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%221547%22%20y%3D%22-106%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%221597%22%20y%3D%2258%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23gift%22%20x%3D%221403%22%20y%3D%22-139%22%20width%3D%2270%22%20height%3D%2275%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23heart%22%20x%3D%221423%22%20y%3D%2217%22%20width%3D%2262%22%20height%3D%2257%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23sound%22%20x%3D%22136%22%20y%3D%221627%22%20width%3D%2269%22%20height%3D%2276%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23lips%22%20x%3D%22-17%22%20y%3D%221564%22%20width%3D%2272%22%20height%3D%2259%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23crown%22%20x%3D%2265%22%20y%3D%221463%22%20width%3D%2280%22%20height%3D%2276%22%2F%3E%0A%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-15%22%20y%3D%22856%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%2268%22%20y%3D%22959%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-4%22%20y%3D%221028%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%2290%22%20y%3D%221096%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-64%22%20y%3D%221212%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-123%22%20y%3D%221318%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22192%22%20y%3D%221278%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22144%22%20y%3D%221402%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-154%22%20y%3D%221289%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-41%22%20y%3D%221399%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22161%22%20y%3D%22826%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-177%22%20y%3D%22859%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%2263%22%20y%3D%221166%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%2287%22%20y%3D%221254%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22182%22%20y%3D%221084%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22-108%22%20y%3D%22924%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%227%22%20y%3D%221354%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-15%22%20y%3D%22228%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%2268%22%20y%3D%22331%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-4%22%20y%3D%22400%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%2290%22%20y%3D%22468%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-64%22%20y%3D%22584%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-123%22%20y%3D%22690%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22192%22%20y%3D%22650%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22144%22%20y%3D%22774%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-154%22%20y%3D%22661%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-41%22%20y%3D%22771%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22161%22%20y%3D%22198%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-177%22%20y%3D%22231%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%2263%22%20y%3D%22538%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%2287%22%20y%3D%22626%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22182%22%20y%3D%22456%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22-108%22%20y%3D%22296%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%227%22%20y%3D%22726%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%2290%22%20y%3D%22-156%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-64%22%20y%3D%22-39%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-123%22%20y%3D%2265%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22192%22%20y%3D%2225%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22144%22%20y%3D%22149%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-154%22%20y%3D%2236%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-41%22%20y%3D%22147%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%2263%22%20y%3D%22-86%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%2287%22%20y%3D%221%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22182%22%20y%3D%22-168%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%227%22%20y%3D%22101%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22250%22%20y%3D%221145%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22413%22%20y%3D%221174%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22605%22%20y%3D%221147%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22482%22%20y%3D%221434%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22500%22%20y%3D%221277%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22388%22%20y%3D%221369%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22309%22%20y%3D%221463%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22453%22%20y%3D%221501%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22575%22%20y%3D%221550%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22743%22%20y%3D%221174%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22875%22%20y%3D%221257%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221153%22%20y%3D%221174%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221237%22%20y%3D%221277%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221164%22%20y%3D%221347%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221259%22%20y%3D%221414%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221104%22%20y%3D%221531%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22947%22%20y%3D%221434%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22839%22%20y%3D%221605%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221045%22%20y%3D%221636%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221361%22%20y%3D%221596%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22656%22%20y%3D%221341%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22344%22%20y%3D%221647%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22350%22%20y%3D%221234%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22592%22%20y%3D%221427%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22508%22%20y%3D%221618%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22323%22%20y%3D%221560%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221014%22%20y%3D%221607%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221330%22%20y%3D%221144%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22991%22%20y%3D%221177%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221232%22%20y%3D%221484%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221256%22%20y%3D%221573%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22666%22%20y%3D%221590%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22770%22%20y%3D%221457%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22460%22%20y%3D%221380%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22749%22%20y%3D%221272%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22947%22%20y%3D%221335%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22419%22%20y%3D%221536%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22563%22%20y%3D%221220%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221351%22%20y%3D%221402%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221060%22%20y%3D%221242%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22303%22%20y%3D%221361%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22250%22%20y%3D%22517%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22413%22%20y%3D%22546%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22605%22%20y%3D%22519%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22482%22%20y%3D%22806%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22500%22%20y%3D%22649%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22388%22%20y%3D%22741%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22309%22%20y%3D%22835%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22453%22%20y%3D%22873%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22575%22%20y%3D%22922%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22743%22%20y%3D%22546%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22875%22%20y%3D%22629%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221153%22%20y%3D%22546%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221237%22%20y%3D%22649%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221164%22%20y%3D%22719%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221259%22%20y%3D%22786%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221104%22%20y%3D%22903%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22947%22%20y%3D%22806%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22839%22%20y%3D%22977%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22963%22%20y%3D%221064%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221045%22%20y%3D%221008%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221361%22%20y%3D%22968%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221313%22%20y%3D%221092%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22656%22%20y%3D%22713%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22583%22%20y%3D%221088%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22344%22%20y%3D%221019%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22350%22%20y%3D%22606%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22592%22%20y%3D%22799%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22508%22%20y%3D%22990%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22323%22%20y%3D%22932%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221014%22%20y%3D%22979%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221127%22%20y%3D%221090%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221330%22%20y%3D%22516%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22991%22%20y%3D%22549%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221232%22%20y%3D%22856%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221256%22%20y%3D%22945%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22666%22%20y%3D%22962%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22770%22%20y%3D%22829%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22460%22%20y%3D%22752%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22749%22%20y%3D%22644%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22297%22%20y%3D%221049%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22947%22%20y%3D%22707%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22419%22%20y%3D%22908%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22563%22%20y%3D%22592%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221351%22%20y%3D%22774%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221060%22%20y%3D%22614%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221176%22%20y%3D%221044%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22303%22%20y%3D%22733%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22418%22%20y%3D%221102%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22791%22%20y%3D%221106%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22250%22%20y%3D%22-107%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22413%22%20y%3D%22-78%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22605%22%20y%3D%22-105%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22482%22%20y%3D%22181%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22500%22%20y%3D%2224%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22388%22%20y%3D%22116%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22309%22%20y%3D%22210%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22453%22%20y%3D%22248%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22575%22%20y%3D%22298%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22743%22%20y%3D%22-78%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22875%22%20y%3D%224%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221153%22%20y%3D%22-78%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221237%22%20y%3D%2224%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221164%22%20y%3D%2294%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221259%22%20y%3D%22161%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221104%22%20y%3D%22278%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22947%22%20y%3D%22181%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22839%22%20y%3D%22352%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22963%22%20y%3D%22439%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221045%22%20y%3D%22383%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221361%22%20y%3D%22343%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221313%22%20y%3D%22467%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22656%22%20y%3D%2288%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22583%22%20y%3D%22463%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22344%22%20y%3D%22394%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22350%22%20y%3D%22-17%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22592%22%20y%3D%22174%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22508%22%20y%3D%22365%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22323%22%20y%3D%22307%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221014%22%20y%3D%22354%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221127%22%20y%3D%22465%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221330%22%20y%3D%22-107%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22991%22%20y%3D%22-75%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221232%22%20y%3D%22231%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221256%22%20y%3D%22320%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22666%22%20y%3D%22337%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22770%22%20y%3D%22204%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22460%22%20y%3D%22127%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22749%22%20y%3D%2220%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22297%22%20y%3D%22424%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22947%22%20y%3D%2282%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%22419%22%20y%3D%22283%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22563%22%20y%3D%22-31%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221351%22%20y%3D%22150%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221060%22%20y%3D%22-10%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%221176%22%20y%3D%22419%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22303%22%20y%3D%22108%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22418%22%20y%3D%22477%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22791%22%20y%3D%22481%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221313%22%20y%3D%22-160%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22583%22%20y%3D%22-164%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221127%22%20y%3D%22-162%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22418%22%20y%3D%22-150%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%22791%22%20y%3D%22-146%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221419%22%20y%3D%221463%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221582%22%20y%3D%221492%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221519%22%20y%3D%221553%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221419%22%20y%3D%22835%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221582%22%20y%3D%22864%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221651%22%20y%3D%221124%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221556%22%20y%3D%221059%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221478%22%20y%3D%221153%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221602%22%20y%3D%221191%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221513%22%20y%3D%221337%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221519%22%20y%3D%22925%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221491%22%20y%3D%221250%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221628%22%20y%3D%221070%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221466%22%20y%3D%221367%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221587%22%20y%3D%221226%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%221471%22%20y%3D%221051%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%221587%22%20y%3D%221420%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221419%22%20y%3D%22210%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221582%22%20y%3D%22239%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221651%22%20y%3D%22499%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221556%22%20y%3D%22435%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221478%22%20y%3D%22528%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221602%22%20y%3D%22567%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221513%22%20y%3D%22713%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221519%22%20y%3D%22300%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221491%22%20y%3D%22626%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221628%22%20y%3D%22446%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221466%22%20y%3D%22742%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221587%22%20y%3D%22601%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%221471%22%20y%3D%22426%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%221587%22%20y%3D%22795%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221651%22%20y%3D%22-128%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221478%22%20y%3D%22-99%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221602%22%20y%3D%22-60%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%221513%22%20y%3D%2285%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%221491%22%20y%3D%22-2%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221466%22%20y%3D%22114%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot2%22%20x%3D%221587%22%20y%3D%22-26%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot4%22%20x%3D%221587%22%20y%3D%22167%22%20width%3D%2235%22%20height%3D%2235%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%22-15%22%20y%3D%221486%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot0%22%20x%3D%2268%22%20y%3D%221589%22%20width%3D%2211%22%20height%3D%2211%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22-177%22%20y%3D%221489%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot3%22%20x%3D%22-108%22%20y%3D%221554%22%20width%3D%2223%22%20height%3D%2223%22%2F%3E%0A%20%20%20%20%3Cuse%20xlink%3Ahref%3D%22%23dot1%22%20x%3D%22167%22%20y%3D%221453%22%20width%3D%2216%22%20height%3D%2216%22%2F%3E%0A%3C%2Fsvg%3E%0A";
/** Telegram splash.ts: green pattern with a centred white progress track, no logo. */
function OriginalLoadingScreen() {
	const { progress, ready, error } = useGameLoading();
	const patternImage = (0, import_react.useRef)(null);
	const artworkReady = () => completeLoadingStage("artwork");
	(0, import_react.useEffect)(() => {
		const image = patternImage.current;
		if (image?.complete) if (image.naturalWidth > 0) artworkReady();
		else image.src = loadingPatternFallback;
		const unlock = () => unlockSfx();
		document.addEventListener("pointerdown", unlock, { once: true });
		document.addEventListener("keydown", unlock, { once: true });
		return () => {
			document.removeEventListener("pointerdown", unlock);
			document.removeEventListener("keydown", unlock);
		};
	}, []);
	if (ready) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "original-loading-screen",
		"aria-label": "Şüşə oyunu yüklənir",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: patternImage,
				className: "original-loading-pattern",
				src: ui_loading_pattern_default,
				alt: "",
				onLoad: artworkReady,
				onError: (e) => {
					e.currentTarget.src = loadingPatternFallback;
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "splash__bg",
				role: "progressbar",
				"aria-label": "Oyun yüklənir",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": progress,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "splash__bar",
					style: { width: `${progress}%` }
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "original-loading-retry",
				onClick: () => window.location.reload(),
				children: "Yenidən cəhd et"
			})
		]
	});
}
var sourceDisconnect = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22124%22%20height%3D%22136%22%20viewBox%3D%220%200%20124%20136%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22a%22%20x1%3D%2249.997%25%22%20x2%3D%2249.997%25%22%20y1%3D%222.595%25%22%20y2%3D%2281.423%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23D9F6FF%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.98%25%22%20stop-color%3D%22%23AED6F2%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22b%22%20x1%3D%22.003%25%22%20x2%3D%22100.011%25%22%20y1%3D%2249.991%25%22%20y2%3D%2249.991%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%224.12%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2219.73%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2235.13%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2264.86%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2280.26%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2295.85%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.98%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22c%22%20x1%3D%22-.006%25%22%20x2%3D%22100.002%25%22%20y1%3D%2249.991%25%22%20y2%3D%2249.991%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%224.12%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2219.73%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2235.13%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2264.86%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2280.26%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2295.85%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.98%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22d%22%20x1%3D%22.029%25%22%20x2%3D%22100.017%25%22%20y1%3D%2250.006%25%22%20y2%3D%2250.006%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%224.12%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2219.73%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2235.13%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2264.86%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2280.26%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2295.85%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.98%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22e%22%20x1%3D%22-.011%25%22%20x2%3D%22100.016%25%22%20y1%3D%2250.006%25%22%20y2%3D%2250.006%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%224.12%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2219.73%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2235.13%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2264.86%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2280.26%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2295.85%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.98%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22f%22%20x1%3D%2249.886%25%22%20x2%3D%2249.886%25%22%20y1%3D%22100.003%25%22%20y2%3D%22-.009%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%224.12%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2219.73%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2235.13%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2264.85%25%22%20stop-color%3D%22%23877A7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2280.24%25%22%20stop-color%3D%22%237B6E6E%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2295.83%25%22%20stop-color%3D%22%23675A5A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23605353%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%25%22%20x2%3D%22100.005%25%22%20y1%3D%2250.043%25%22%20y2%3D%2250.043%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23736363%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%222.42%25%22%20stop-color%3D%22%23766767%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2218.6%25%22%20stop-color%3D%22%238A7B7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2234.58%25%22%20stop-color%3D%22%23958788%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23998B8C%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2265.42%25%22%20stop-color%3D%22%23958788%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2281.4%25%22%20stop-color%3D%22%238A7B7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2297.58%25%22%20stop-color%3D%22%23766767%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23736363%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22h%22%20x1%3D%22-134.461%25%22%20x2%3D%2293.705%25%22%20y1%3D%2250.036%25%22%20y2%3D%2250.036%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F7B14A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23F7BA61%22%20stop-opacity%3D%22.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22i%22%20x1%3D%22-84.335%25%22%20x2%3D%22204.373%25%22%20y1%3D%2250.002%25%22%20y2%3D%2250.002%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F7B14A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23F7BA61%22%20stop-opacity%3D%22.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22j%22%20x1%3D%221.811%25%22%20x2%3D%22395.557%25%22%20y1%3D%2250.005%25%22%20y2%3D%2250.005%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F7B14A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23F7BA61%22%20stop-opacity%3D%22.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22k%22%20x1%3D%22234.985%25%22%20x2%3D%226.073%25%22%20y1%3D%2250.002%25%22%20y2%3D%2250.002%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F7B14A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23F7BA61%22%20stop-opacity%3D%22.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22l%22%20x1%3D%22184.998%25%22%20x2%3D%22-104.654%25%22%20y1%3D%2250.002%25%22%20y2%3D%2250.002%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F7B14A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23F7BA61%22%20stop-opacity%3D%22.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22m%22%20x1%3D%2299.092%25%22%20x2%3D%22-295.938%25%22%20y1%3D%2250.006%25%22%20y2%3D%2250.006%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F7B14A%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23F7BA61%22%20stop-opacity%3D%22.5%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22n%22%20x1%3D%2249.963%25%22%20x2%3D%2249.963%25%22%20y1%3D%2299.992%25%22%20y2%3D%22.039%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23A69798%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22o%22%20x1%3D%22.007%25%22%20x2%3D%22100.016%25%22%20y1%3D%2249.98%25%22%20y2%3D%2249.98%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23736363%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%222.42%25%22%20stop-color%3D%22%23766767%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2218.6%25%22%20stop-color%3D%22%238A7B7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2234.58%25%22%20stop-color%3D%22%23958788%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23998B8C%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2265.42%25%22%20stop-color%3D%22%23958788%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2281.4%25%22%20stop-color%3D%22%238A7B7B%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2297.58%25%22%20stop-color%3D%22%23766767%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23736363%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22p%22%20x1%3D%2249.993%25%22%20x2%3D%2249.993%25%22%20y1%3D%22104.677%25%22%20y2%3D%220%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%238B7E7F%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2299.95%25%22%20stop-color%3D%22%23A69798%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3CradialGradient%20id%3D%22q%22%20cx%3D%2249.997%25%22%20cy%3D%2249.997%25%22%20r%3D%2249.997%25%22%20fx%3D%2249.997%25%22%20fy%3D%2249.997%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23FFF%22%20stop-opacity%3D%220%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%2270.631%25%22%20stop-color%3D%22%23FFF%22%20stop-opacity%3D%22.306%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23AED6F2%22%20stop-opacity%3D%22.7%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22r%22%20x1%3D%2249.988%25%22%20x2%3D%2249.988%25%22%20y1%3D%22-25.474%25%22%20y2%3D%22134.208%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F69347%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23F24200%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%20%20%20%20%3ClinearGradient%20id%3D%22s%22%20x1%3D%2249.986%25%22%20x2%3D%2249.986%25%22%20y1%3D%22-25.495%25%22%20y2%3D%22134.231%25%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F67C1C%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23DC3C00%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2261.95%22%20cy%3D%2261.95%22%20r%3D%2261.95%22%20fill%3D%22url(%23a)%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2261.95%22%20cy%3D%2261.95%22%20r%3D%2261.95%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cg%20fill%3D%22%23FFF%22%20opacity%3D%22.7%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M24.59%2057.8c0-2.63%202.13-4.76%204.76-4.76.4%200%20.78.06%201.14.15%201.24-1.34%203-2.19%204.97-2.19a6.8%206.8%200%200%201%206.8%206.8H24.59z%22%20opacity%3D%22.6%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M27.97%2052.34c-.57%200-1.11.11-1.63.28a9.073%209.073%200%200%200-7.46-3.91c-3.09%200-5.82%201.55-7.46%203.91-.52-.16-1.06-.28-1.63-.28a5.45%205.45%200%200%200-5.45%205.45h29.09c0-3-2.45-5.45-5.46-5.45z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3Cg%20fill%3D%22%23FFF%22%20opacity%3D%22.7%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M86.48%2069.07c0-2.48%202.01-4.48%204.48-4.48.37%200%20.73.06%201.08.15%201.17-1.26%202.83-2.07%204.69-2.07a6.41%206.41%200%200%201%206.41%206.41H86.48v-.01z%22%20opacity%3D%22.6%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M91.83%2073.88c0-3.72%203.01-6.73%206.73-6.73.56%200%201.1.09%201.62.22%201.76-1.9%204.25-3.1%207.04-3.1%205.31%200%209.62%204.31%209.62%209.62H91.83v-.01z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M51.83%2016.88c0-3.72%203.01-6.73%206.73-6.73.56%200%201.1.09%201.62.22%201.76-1.9%204.25-3.1%207.04-3.1%205.31%200%209.62%204.31%209.62%209.62H51.83v-.01z%22%20opacity%3D%22.4%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23b)%22%20d%3D%22M37.3%20107.95l-2.11-2.82%2041.03-30.66%202.1%202.82z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23c)%22%20d%3D%22M86.59%20107.95L45.57%2077.29l2.11-2.82%2041.02%2030.66z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23d)%22%20d%3D%22M47.59%2073.11c-.45%200-.9-.17-1.25-.52-.69-.69-.69-1.8%200-2.49l21.99-21.94c.69-.69%201.8-.69%202.49%200%20.69.69.69%201.8%200%202.49L48.83%2072.6c-.34.34-.79.51-1.24.51z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23e)%22%20d%3D%22M76.3%2073.11c-.45%200-.9-.17-1.24-.51L53.07%2050.65c-.69-.69-.69-1.8%200-2.49.69-.69%201.8-.69%202.49%200L77.54%2070.1c.69.69.69%201.8%200%202.49-.34.35-.79.52-1.24.52z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23f)%22%20d%3D%22M60.19%2035.61h3.52v11.56h-3.52z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23g)%22%20d%3D%22M47.59%2071.6H76.3v3.52H47.59z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23h)%22%20d%3D%22M86.04%2046.28c-.45%200-.9-.17-1.24-.52-.69-.69-.69-1.8%200-2.49%203.15-3.15%204.88-7.33%204.88-11.79%200-4.45-1.73-8.64-4.88-11.79-.69-.69-.69-1.8%200-2.49.69-.69%201.8-.69%202.49%200%203.81%203.81%205.91%208.88%205.91%2014.27%200%205.39-2.1%2010.46-5.91%2014.27-.35.37-.8.54-1.25.54z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23i)%22%20d%3D%22M79.49%2041.75c-.45%200-.9-.17-1.24-.52-.69-.69-.69-1.8%200-2.49%201.94-1.94%203-4.51%203-7.25s-1.07-5.32-3-7.25c-.69-.69-.69-1.8%200-2.49.69-.69%201.8-.69%202.49%200%202.6%202.6%204.04%206.06%204.04%209.74%200%203.68-1.43%207.14-4.04%209.74-.34.35-.79.52-1.25.52z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23j)%22%20d%3D%22M72.95%2037.22c-.45%200-.9-.17-1.24-.52-.69-.69-.69-1.8%200-2.49.73-.73%201.13-1.69%201.13-2.72%200-1.03-.4-1.99-1.13-2.72-.69-.69-.69-1.8%200-2.49.69-.69%201.8-.69%202.49%200a7.322%207.322%200%200%201%202.16%205.21c0%201.97-.77%203.82-2.16%205.21-.35.35-.8.52-1.25.52z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23k)%22%20d%3D%22M37.85%2046.28c-.45%200-.9-.17-1.24-.52a20.053%2020.053%200%200%201-5.91-14.27c0-5.39%202.1-10.46%205.91-14.27.69-.69%201.8-.69%202.49%200%20.69.69.69%201.8%200%202.49a16.548%2016.548%200%200%200-4.88%2011.79c0%204.46%201.73%208.64%204.88%2011.79.69.69.69%201.8%200%202.49-.35.33-.8.5-1.25.5z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23l)%22%20d%3D%22M44.4%2041.75c-.45%200-.9-.17-1.24-.52-2.6-2.6-4.04-6.06-4.04-9.74%200-3.68%201.43-7.14%204.04-9.74.69-.69%201.8-.69%202.49%200%20.69.69.69%201.8%200%202.49-1.94%201.94-3%204.51-3%207.25s1.07%205.31%203%207.25c.69.69.69%201.8%200%202.49-.35.35-.8.52-1.25.52z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23m)%22%20d%3D%22M50.94%2037.22c-.45%200-.9-.17-1.24-.52a7.322%207.322%200%200%201-2.16-5.21c0-1.97.77-3.82%202.16-5.21.69-.69%201.8-.69%202.49%200%20.69.69.69%201.8%200%202.49-.73.73-1.13%201.69-1.13%202.72%200%201.03.4%201.99%201.13%202.72.69.69.69%201.8%200%202.49-.35.35-.8.52-1.25.52z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23n)%22%20fill-rule%3D%22nonzero%22%20d%3D%22M61.95%2037.37a5.89%205.89%200%200%201-5.88-5.88%205.89%205.89%200%200%201%205.88-5.88%205.89%205.89%200%200%201%205.88%205.88%205.89%205.89%200%200%201-5.88%205.88zm0-8.24c-1.3%200-2.36%201.06-2.36%202.36%200%201.3%201.06%202.36%202.36%202.36%201.3%200%202.36-1.06%202.36-2.36a2.37%202.37%200%200%200-2.36-2.36z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23o)%22%20d%3D%22M36.49%20105.92h50.9v3.52h-50.9z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22url(%23p)%22%20d%3D%22M53.65%2045.41l-22.18%2070.46c1.04.59%202.09%201.15%203.16%201.68l21.6-68.61h11.44l21.6%2068.61c1.07-.53%202.12-1.09%203.16-1.68L70.25%2045.41h-16.6z%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M22.79%2091.45h4.39c0-2.6-2.11-4.72-4.72-4.72-.39%200-.77.06-1.13.15-.06-.07-.14-.13-.2-.2a7.658%207.658%200%200%200-6.02-2.92c-2.23%200-4.22.96-5.62%202.48-.42-.1-.85-.17-1.29-.17-1.08%200-2.08.32-2.92.87.68%201.53%201.4%203.04%202.2%204.51H22.79z%22%20opacity%3D%22.6%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2261.95%22%20cy%3D%2261.95%22%20r%3D%2261.95%22%20fill%3D%22url(%23q)%22%20style%3D%22mix-blend-mode%3Amultiply%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cg%20transform%3D%22translate(44%20101)%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2217.95%22%20cy%3D%2217.66%22%20r%3D%2217.34%22%20fill%3D%22url(%23r)%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2217.95%22%20cy%3D%2217.66%22%20r%3D%2215.12%22%20fill%3D%22url(%23s)%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20fill%3D%22%23FFF%22%20transform%3D%22translate(14%206)%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%223.95%22%20cy%3D%2220.24%22%20r%3D%222.94%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M6.36.14H1.53C1.22.14.98.4%201%20.7l.98%2013.85c.02.28.25.49.53.49h2.87c.28%200%20.51-.21.53-.49L6.89.7c.02-.3-.22-.56-.53-.56z%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A";
function SourceConnectionScreen() {
	const room = useRoom();
	const [offline, setOffline] = (0, import_react.useState)(false);
	const [lost, setLost] = (0, import_react.useState)(false);
	const [retrying, setRetrying] = (0, import_react.useState)(false);
	const [translations, setTranslations] = (0, import_react.useState)({});
	const dialog = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		loadCilizAssets().then((assets) => {
			if (active) setTranslations(assets.translation);
		}, () => {});
		const off = () => setOffline(true);
		const on = () => {
			setOffline(false);
		};
		setOffline(!navigator.onLine);
		window.addEventListener("offline", off);
		window.addEventListener("online", on);
		return () => {
			active = false;
			window.removeEventListener("offline", off);
			window.removeEventListener("online", on);
		};
	}, []);
	const visible = offline || lost || Boolean(room.error && !room.connected);
	(0, import_react.useEffect)(() => {
		if (!visible) return;
		const previous = document.activeElement;
		dialog.current?.focus();
		const blocked = [];
		const screen = dialog.current?.parentElement;
		for (const element of Array.from(document.querySelectorAll("body > *"))) {
			if (element.contains(screen ?? null)) continue;
			if (!element.inert) {
				element.inert = true;
				blocked.push(element);
			}
		}
		const keyboard = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopImmediatePropagation();
			}
			if (event.key === "Tab") {
				event.preventDefault();
				dialog.current?.querySelector("button")?.focus();
			}
		};
		document.addEventListener("keydown", keyboard, true);
		return () => {
			blocked.forEach((element) => {
				element.inert = false;
			});
			document.removeEventListener("keydown", keyboard, true);
			if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
		};
	}, [visible]);
	const retry = async () => {
		if (retrying || !navigator.onLine) return;
		setRetrying(true);
		try {
			await joinRoom();
			setLost(false);
		} catch {
			setLost(true);
		} finally {
			setRetrying(false);
		}
	};
	if (!visible) return null;
	const title = translations["html:dlg:server_error:title"] ?? "Bağlantı yoxdur";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "source-connection-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			ref: dialog,
			tabIndex: -1,
			role: "alertdialog",
			"aria-modal": "true",
			"aria-label": title,
			className: "popup popup--center source-connection-popup",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "popup__header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__title",
						children: title
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "popup__content popup__content--wrap popup__content--center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "source-disconnect-image",
						src: sourceDisconnect,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "info__context",
						children: offline ? "İnternet bağlantısı kəsildi. Bağlantı qayıdanda masana yenidən qoşulacaqsan." : room.error ?? "Bağlantı kəsildi. Masana qayıtmaq üçün yenidən qoşul."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popup__buttons popup__buttons--center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "button button--confirm",
						disabled: offline || retrying,
						onClick: () => void retry(),
						children: retrying ? "Qoşulur…" : "Qayıt"
					})
				})
			]
		})
	});
}
var sourceHeart = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgogICAgIHdpZHRoPSI3MiIgaGVpZ2h0PSI2NiIKCSB2aWV3Qm94PSIwIDAgNzIgNTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDU2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6dXJsKCNTVkdJRF8xXyk7fQo8L3N0eWxlPgo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjM2IiB5MT0iMS42NjY3IiB4Mj0iMzYiIHkyPSI0Ni4zNjc2Ij4KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNGNjcxMUMiLz4KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNEQzM2MDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTUxLjIsMS4xYy03LjksMC0xMyw0LjYtMTQuNiw2LjRjLTAuMywwLjMtMC44LDAuMy0xLjIsMGMtMS42LTEuOC02LjctNi40LTE0LjYtNi40Yy05LjcsMC0xOS43LDguMS0xOS43LDE5LjMKCXM4LDE2LjUsMTUuOSwyMmM2LjQsNC41LDEzLjQsOS4zLDE2LjgsMTEuN2MxLjMsMC45LDMuMSwwLjksNC40LDBDNDEuNiw1MS44LDQ4LjYsNDcsNTUsNDIuNWM3LjgtNS41LDE1LjktMTAuOSwxNS45LTIyCglTNjAuOSwxLjEsNTEuMiwxLjF6Ii8+Cjwvc3ZnPgo=";
var sourceLuckyHeart = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjY4IiBoZWlnaHQ9IjgyIiB2aWV3Qm94PSIwIDAgMjY4IDgyIj4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ib2Q0cnAycjZzYSIgeDE9Ii0zNC42NjklIiB4Mj0iMjEzLjQxMiUiIHkxPSI0OS45ODglIiB5Mj0iNDkuOTg4JSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMjElIiBzdG9wLWNvbG9yPSIjOERCRjQwIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iNzElIiBzdG9wLWNvbG9yPSIjNUU4MDJCIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Ind1NmtnODdkM2IiIHgxPSIxMzQuNjM5JSIgeDI9Ii0xMTMuMzE2JSIgeTE9IjQ5Ljk3MyUiIHkyPSI0OS45NzMlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzYzODUyRCIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QzY2MjIiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iNjIwOTVrN3YwYyIgeDE9IjElIiB4Mj0iMTAwJSIgeTE9IjQ5Ljk4OCUiIHkyPSI0OS45ODglIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzlBQ0MzMyIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzhEQkY0MCIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5QUNDMzMiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icmRqcXF2bmY0ZiIgeDE9IjQ5LjkxMiUiIHgyPSI0OS45MTIlIiB5MT0iLjc1NCUiIHkyPSI4NC40NDElIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2NzExQyIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNEQzM2MDAiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxmaWx0ZXIgaWQ9IjF4ZmNuNzUxbGQiIHdpZHRoPSIxNTEuNiUiIGhlaWdodD0iMTY1LjElIiB4PSItMjUuOCUiIHk9Ii0yNy41JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgICAgICAgPGZlTW9ycGhvbG9neSBpbj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJkaWxhdGUiIHJhZGl1cz0iMS41IiByZXN1bHQ9InNoYWRvd1NwcmVhZE91dGVyMSIvPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHk9IjEiIGluPSJzaGFkb3dTcHJlYWRPdXRlcjEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMS41Ii8+CiAgICAgICAgICAgIDxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1ck91dGVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9Im91dCIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJzaGFkb3dCbHVyT3V0ZXIxIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMyAwIi8+CiAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPHBhdGggaWQ9ImgybWNoZWpndWUiIGQ9Ik0xMi45NiAxOS45NzVjLS4zODEuMDA1LS43NTUtLjExLTEuMDY4LS4zMjgtLjU1Ni0uNDE2LTEuNDEyLTEuMDEtMi40LTEuN3MtMi4yNzctMS41OTQtMy40MDYtMi40MTdsLS4zMTgtLjIzQzMuMTIxIDEzLjM0My4zOTQgMTEuMzE1LjM5NCA3LjI4N2MuMDEyLTEuOTg1Ljg1NC0zLjg3NCAyLjMyLTUuMjA2QzQuMDc4Ljc4IDUuODc1LjA0IDcuNzU1IDBjMS45ODQuMDAxIDMuODg4Ljc5IDUuMjk0IDIuMTk2QzE0LjQ1OC43OTUgMTYuMzYuMDA2IDE4LjM0MyAwYzEuOTY3LjAyNSAzLjg0NC44MzQgNS4yMTUgMi4yNDkgMS4zMyAxLjMzNSAyLjA2OCAzLjE1IDIuMDQ4IDUuMDM4IDAgNC4xMzUtMi43OTggNi4xNDUtNS41MDcgOC4wOTJsLS4xOTQuMTQyYy0xLjQxMiAxLjAzNi0yLjkzOSAyLjA5OS00LjE1NiAyLjk1N2wtMS43MyAxLjE3Yy0uMzEuMjE2LS42OC4zMy0xLjA1OS4zMjd6Ii8+CiAgICA8L2RlZnM+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjMiIGQ9Ik0xMzMtLjVjNi40ODYgMCAxMi40MDcgMi40MjIgMTYuOTA3IDYuNDEgNC40NDcgMy45NDIgNy41MDcgOS40MTMgOC4zNTUgMTUuNTloODQuNzM3Yy42NTcgMCAxLjI1NC4yNTMgMS43LjY2Ny40NTQuNDIxLjc1MSAxLjAxLjc5NSAxLjY2NmgwbC4wMDUgNS42NjcgMTYuNTYzLjAwMmMxLjI3Ny4wMzggMi40NzYuNjEgMy4zMSAxLjU2OSAxLjE2IDEuNjIxIDEuMzQyIDMuMTE2Ljg4OCA0LjQ3M2gwbC03LjA3IDE5LjQ5OSA2Ljk3NiAxOS4xOGMuNDk5IDEuMjU4LjQxNCAyLjY2NC0uMjExIDMuODQ0LTEuMTMgMS42OTQtMi40NzcgMi4zODgtMy44NjIgMi40MzFoMC0zMC45NzRjLS42MzQuMDI1LTEuMjM3LS4xODctMS43MDQtLjU2Ni0uNDcyLS4zODQtLjgwNi0uOTM4LS44OTMtMS41OTNoMEwyMjguNSA3Mi41SDM3LjQ5OVY3OGMwIC42OTQtLjI3MyAxLjI5Ni0uNyAxLjczNy0uNDUxLjQ2NC0xLjA3NS43NDctMS43MzUuNzY1aDBsLTMxLjEyNy0uMDA0Yy0xLjI3Ny0uMDM4LTIuNDc2LS42MS0zLjMxLTEuNTY5LTEuMTYtMS42MjEtMS4zNDItMy4xMTYtLjg4OS00LjQ3M2gwbDcuMDctMTkuNS02Ljk3NS0xOS4xOGMtLjUtMS4yNTctLjQxNS0yLjY2My4yMS0zLjg0MyAxLjEzLTEuNjk0IDIuNDc4LTIuMzg4IDMuODYyLTIuNDMxaDBMMjAuNSAyOS41VjI0YzAtLjYyMi4yMjctMS4xOS42MDMtMS42MjguMzg5LS40NTMuOTM4LS43NjUgMS41NTktLjg1aDBsODUuMDc3LS4wMjJjLjg0OC02LjE3NyAzLjkwOC0xMS42NDggOC4zNTUtMTUuNTlDMTIwLjU5MyAxLjkyMiAxMjYuNTEzLS41IDEzMy0uNXoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNTYuMDAwMDAwLCAtMjA3LjAwMDAwMCkgdHJhbnNsYXRlKDI1Ny4wMDAwMDAsIDIwOC4wMDAwMDApIi8+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbD0idXJsKCNvZDRycDJyNnNhKSIgZD0iTTM1IDc4SDQuMTIzYy0uNjk3LjAxNi0xLjM1Ni0uMzItMS43NTQtLjg5NS0uMzk4LS41NzUtLjQ4MS0xLjMxMy0uMjIyLTEuOTYzbDcuMzUtMjAuMTg3LTcuMzQtMjAuMDk3Yy0uMjYtLjY1LS4xNzYtMS4zODguMjIyLTEuOTYzLjM5OC0uNTc1IDEuMDU3LS45MTEgMS43NTQtLjg5NGgzMC44NjV2NDUuOTk4eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI1Ni4wMDAwMDAsIC0yMDcuMDAwMDAwKSB0cmFuc2xhdGUoMjU3LjAwMDAwMCwgMjA4LjAwMDAwMCkiLz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSJ1cmwoI29kNHJwMnI2c2EpIiBkPSJNMjY0IDc4aC0zMC44NzZjLS42OTcuMDE2LTEuMzU2LS4zMi0xLjc1NC0uODk1LS4zOTgtLjU3NS0uNDgxLTEuMzEzLS4yMjItMS45NjNsNy4zNS0yMC4xODctNy4zNC0yMC4wOTdjLS4yNi0uNjUtLjE3Ni0xLjM4OC4yMjItMS45NjMuMzk4LS41NzUgMS4wNTctLjkxMSAxLjc1NC0uODk0aDMwLjg2NXY0NS45OTh6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU2LjAwMDAwMCwgLTIwNy4wMDAwMDApIHRyYW5zbGF0ZSgyNTcuMDAwMDAwLCAyMDguMDAwMDAwKSB0cmFuc2xhdGUoMjQ3LjQ5OTE5NCwgNTUuMDAwMDAwKSBzY2FsZSgtMSwgLTEpIHRyYW5zbGF0ZSgtMjQ3LjQ5OTE5NCwgLTU1LjAwMDAwMCkiLz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSJ1cmwoI3d1NmtnODdkM2IpIiBkPSJNMjQyLjk5OSA3MEwyMzAuOTk5IDc4IDIzMC45OTkgNzB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU2LjAwMDAwMCwgLTIwNy4wMDAwMDApIHRyYW5zbGF0ZSgyNTcuMDAwMDAwLCAyMDguMDAwMDAwKSIvPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9InVybCgjd3U2a2c4N2QzYikiIGQ9Ik0zNC45OTkgNzBMMjIuOTk5IDc4IDIyLjk5OSA3MHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNTYuMDAwMDAwLCAtMjA3LjAwMDAwMCkgdHJhbnNsYXRlKDI1Ny4wMDAwMDAsIDIwOC4wMDAwMDApIHRyYW5zbGF0ZSgyOC45OTkxOTQsIDc0LjAwMDAwMCkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMjguOTk5MTk0LCAtNzQuMDAwMDAwKSIvPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9InVybCgjNjIwOTVrN3YwYykiIGQ9Ik0xMzMgMmMxMi4zNjggMCAyMi40NTUgOS43NjIgMjIuOTc5IDIyaDg3LjAydjQ2SDIzVjI0aDg3LjAyMkMxMTAuNTQ1IDExLjc2MiAxMjAuNjMyIDIgMTMzIDJ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU2LjAwMDAwMCwgLTIwNy4wMDAwMDApIHRyYW5zbGF0ZSgyNTcuMDAwMDAwLCAyMDguMDAwMDAwKSIvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPGcgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI1Ni4wMDAwMDAsIC0yMDcuMDAwMDAwKSB0cmFuc2xhdGUoMjU3LjAwMDAwMCwgMjA4LjAwMDAwMCkgdHJhbnNsYXRlKDEyMC4wMDAwMDAsIDEyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCMxeGZjbjc1MWxkKSIgeGxpbms6aHJlZj0iI2gybWNoZWpndWUiLz4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbD0idXJsKCNyZGpxcXZuZjRmKSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiNGRkYiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNMTguMzQtLjc1YzIuMTguMDI3IDQuMjQ2LjkxOCA1Ljc1IDIuNDcgMS40NzEgMS40NzcgMi4yODggMy40ODYgMi4yNjYgNS41NjcgMCA0LjE5MS0yLjYyMSA2LjM5LTUuMzkgOC4zOTNoMGwtLjQyMy4zMDRjLTEuMzEyLjk2Mi0yLjU3IDEuODQ3LTMuNjUzIDIuNjA4bC0uNzE1LjUwNGgwbC0xLjcyNiAxLjE2NmMtLjQzNi4zMDUtLjk1Ni40NjctMS40ODguNDYzLS41MzUuMDA1LTEuMDU4LS4xNTYtMS40OTgtLjQ2My0uNDk3LS4zNzEtMS4xOTctLjg2LTIuMDEyLTEuNDI5LTEuMzgxLS45NjUtMi42NzQtMS44Ny0zLjgwOS0yLjY5OGgwbC0uNzUxLS41NTJjLTIuNy0yLjAwOS01LjI0Ny00LjIxNy01LjI0Ny04LjMuMDE0LTIuMTk2Ljk0NS00LjI4NCAyLjU2Ni01Ljc1N0MzLjcwNy4xMDUgNS42NzctLjcwNiA3LjczOC0uNzVjMS45Ni4wMDEgMy44MzIuNjkgNS4zMTIgMS45M0MxNC41My0uMDU3IDE2LjQtLjc0NCAxOC4zNC0uNzV6Ii8+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K";
/** Presentation only: the authenticated adapter owns awards and wallet readback. */
function SourceHeartBonus() {
	const layer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		let assets;
		const seen = /* @__PURE__ */ new Set();
		const animations = /* @__PURE__ */ new Set();
		loadCilizAssets().then((value) => {
			if (active) {
				assets = value;
				preloadSfx(value.sfxUrl, "drop");
			}
		}, () => {});
		const unsubscribe = subscribeHeartAwards((award) => {
			const host = layer.current;
			const overlay = document.querySelector(".bottle-play-overlay")?.getBoundingClientRect();
			const origin = award.from ?? (overlay ? {
				x: overlay.x,
				y: overlay.y
			} : void 0);
			const target = document.querySelector(".original-heart-button")?.getBoundingClientRect();
			if (seen.has(award.id)) return;
			if (!assets || !host || !origin || !target) {
				if (award.prepaid) setPendingGold(-award.amount);
				return;
			}
			seen.add(award.id);
			if (!award.prepaid) setPendingGold(award.amount);
			if (seen.size > 1e3) seen.delete(seen.values().next().value ?? "");
			const heart = document.createElement("img");
			heart.src = sourceHeart;
			heart.alt = "";
			heart.className = "source-bonus-heart";
			heart.style.left = `${origin.x}px`;
			heart.style.top = `${origin.y}px`;
			host.append(heart);
			playSfx(assets.sfxUrl, "drop");
			const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			const flight = heart.animate([
				{
					transform: "translate(-50%, -50%)",
					opacity: 1,
					offset: 0
				},
				{
					transform: `translate(calc(-50% + ${target.x + target.width / 2 - origin.x}px), calc(-50% + ${target.y + target.height / 2 - origin.y}px))`,
					opacity: 1,
					offset: 2 / 2.3
				},
				{
					transform: `translate(calc(-50% + ${target.x + target.width / 2 - origin.x}px), calc(-50% + ${target.y + target.height / 2 - origin.y}px))`,
					opacity: 0,
					offset: 1
				}
			], {
				duration: reduced ? 1 : 2300,
				easing: "ease-out",
				fill: "forwards"
			});
			animations.add(flight);
			flight.onfinish = () => {
				heart.remove();
				animations.delete(flight);
				setPendingGold(-award.amount);
				target.width && document.querySelector(".original-heart-button")?.animate([
					{ transform: "scale(1)" },
					{
						transform: "scale(1.2)",
						offset: .3
					},
					{
						transform: "scale(0.9)",
						offset: .7
					},
					{ transform: "scale(1)" }
				], {
					duration: 500,
					easing: "linear"
				});
			};
			if (award.lucky) {
				const banner = document.createElement("div");
				banner.className = "source-bonus-banner";
				banner.style.left = `${origin.x}px`;
				banner.style.top = `${origin.y}px`;
				const image = document.createElement("img");
				image.src = sourceLuckyHeart;
				image.alt = "";
				const text = document.createElement("span");
				text.textContent = translate(assets, "table:lucky_bonus:title");
				banner.append(image, text);
				host.append(banner);
				const animation = banner.animate([
					{
						transform: "translate(-50%,-50%) scale(.75)",
						opacity: 1,
						offset: 0
					},
					{
						transform: "translate(-50%,-50%) scale(1)",
						opacity: 1,
						offset: 1 / 1.3
					},
					{
						transform: "translate(-50%,-50%) scale(1)",
						opacity: 0
					}
				], {
					duration: reduced ? 1 : 1300,
					easing: "ease-out",
					fill: "forwards"
				});
				animations.add(animation);
				animation.onfinish = () => {
					banner.remove();
					animations.delete(animation);
				};
			}
		});
		return () => {
			active = false;
			unsubscribe();
			animations.forEach((animation) => animation.cancel());
			setPendingGold(-1e9);
			layer.current?.replaceChildren();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: layer,
		className: "source-heart-bonus-layer",
		"aria-hidden": "true"
	});
}
/** Authenticated bridge: levels come only from my_achievements() (trusted counters + original thresholds). */
function startCloudAchievements() {
	const sb = getSupabase();
	if (!sb) return () => {};
	let snap = {
		verified: false,
		completed: []
	};
	const listeners = /* @__PURE__ */ new Set();
	let alive = true;
	let request = 0;
	let debounce;
	const load = async () => {
		const version = ++request;
		const { data, error } = await sb.rpc("my_achievements");
		if (!alive || error || version !== request) return;
		snap = {
			verified: true,
			completed: (data ?? []).map((r) => ({
				achievement_id: r.achievement_id,
				level: r.level,
				acknowledged_at: r.acknowledged_at
			}))
		};
		listeners.forEach((fn) => fn());
	};
	attachAchievementSession({
		getSnapshot: () => snap,
		subscribe: (fn) => {
			listeners.add(fn);
			return () => {
				listeners.delete(fn);
			};
		},
		acknowledge: async (id, level) => {
			const { error } = await sb.rpc("ack_achievement", {
				p_id: id,
				p_level: level
			});
			if (error) throw error;
			await load();
		}
	});
	load();
	const refresh = () => {
		clearTimeout(debounce);
		debounce = setTimeout(() => void load(), 120);
	};
	const channel = sb.channel(`achievements-${Math.random().toString(36).slice(2)}`).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "profiles"
	}, refresh).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "gift_events"
	}, refresh).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "gesture_events"
	}, refresh).subscribe((status) => {
		if (status === "SUBSCRIBED") refresh();
	});
	const timer = window.setInterval(() => void load(), 1e4);
	return () => {
		alive = false;
		request++;
		clearTimeout(debounce);
		window.clearInterval(timer);
		sb.removeChannel(channel);
		attachAchievementSession(null);
	};
}
/** DailyBonusDialog.tsx + DailyBonusPresenter: the server decides day/gold; closing starts addViewerGold. */
var bem = (block) => (element = "", mods = []) => {
	const base = element ? `${block}__${element}` : block;
	return [base, ...mods.filter(Boolean).map((m) => `${base}--${m}`)].join(" ");
};
var cls = bem("daily-bonus");
var popup = bem("popup");
var DAY_FALLBACK = [
	"1. gün",
	"2. gün",
	"3. gün",
	"4. gün",
	"5. gün"
];
function DailyBonusHost({ viewerId }) {
	const [bonus, setBonus] = (0, import_react.useState)(null);
	const [assets, setAssets] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [a, res] = await Promise.all([loadCilizAssets().catch(() => null), getSupabase()?.rpc("claim_daily_bonus")]);
			if (!alive || !res || res.error || !res.data) return;
			const b = res.data;
			setPendingGold(b.gold_diff);
			setAssets(a);
			setBonus(b);
		})();
		return () => {
			alive = false;
		};
	}, [viewerId]);
	if (!bonus) return null;
	const t = (key, fb) => assets ? translate(assets, key, fb) : fb;
	const close = () => {
		emitServerHeartAward({
			id: `daily:${bonus.id}`,
			viewerId,
			amount: bonus.gold_diff,
			lucky: false,
			prepaid: true
		});
		setBonus(null);
	};
	const title = t("dlg:day_bonus:title", "Günlük bonus");
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 1e3,
			fontFamily: "Arial, Helvetica, sans-serif"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "popup-shade",
				onClick: (e) => {
					e.stopPropagation();
					close();
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": title,
				className: `popup ${cls("x_popup")} popup--center popup--show`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls("bg") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: popup("header"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${popup("title")} ${cls("x_popup__title")}`,
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: popup("close", ["dlg"]),
							role: "button",
							"aria-label": "Bağla",
							onClick: close,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: popup("close-icon") })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: popup("content"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cls(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cls("description"),
								children: t("dlg:day_bonus:desc", "Her gün oyuna gir ve bonus kazan!")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cls("items"),
								children: [
									1,
									2,
									3,
									4,
									5
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cls("item", [i <= bonus.day && "activated", i === bonus.day && "today"]),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cls("day"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cls("checkbox") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cls("day-title"),
											children: t(`dlg:day_bonus:day:${i}`, DAY_FALLBACK[i - 1] ?? `${i}`)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cls("heart"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cls("heart-title"),
											children: i
										})
									})]
								}, i))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${popup("buttons", ["center"])} ${cls("x_popup__buttons")}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "button button--confirm",
							role: "button",
							onClick: close,
							children: t("dlg:day_bonus:btn", "Bonusu al")
						})
					})
				]
			})]
		})
	}), document.body);
}
/** HaremPurchasePresenter.show: the purchaser sees no inbox dialog. */
function haremNotice(p) {
	if (p.newOwner.id === p.viewerId) return null;
	if (p.target.id === p.viewerId) return {
		user: p.newOwner,
		key: p.oldOwner.id === p.viewerId ? "dlg:harem:new:viewer:viewer" : "dlg:harem:new:viewer:old",
		args: [
			p.newOwner.name,
			String(p.newOwner.male),
			p.oldOwner.name
		]
	};
	if (p.oldOwner.id === p.viewerId) return {
		user: p.target,
		key: p.target.id === p.newOwner.id ? "dlg:harem:target:target:viewer" : "dlg:harem:new:target:viewer",
		args: p.target.id === p.newOwner.id ? [p.target.name, String(p.target.male)] : [
			p.newOwner.name,
			String(p.newOwner.male),
			p.target.name
		]
	};
	return null;
}
function user(value) {
	if (!value || typeof value !== "object") return null;
	const v = value;
	if (typeof v.id !== "string" || !v.id || typeof v.name !== "string" || typeof v.male !== "boolean") return null;
	return {
		id: v.id,
		name: v.name,
		male: v.male,
		photoUrl: typeof v.photoUrl === "string" && v.photoUrl ? v.photoUrl : DEFAULT_PHOTO
	};
}
/** Accept only persisted, recipient-matched server events, never ownership guesses. */
function decodeHaremNotice(value, viewerId) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	if (row.user_id !== viewerId || row.read_at != null || !row.payload || typeof row.payload !== "object") return null;
	const id = String(row.id ?? "");
	if (!/^\d+$/.test(id) || id === "0") return null;
	const payload = row.payload;
	if (payload.type !== "harem_purchase" || typeof payload.price !== "number" || !Number.isSafeInteger(payload.price) || payload.price < 1) return null;
	const target = user(payload.target), newOwner = user(payload.newOwner), oldOwner = user(payload.oldOwner);
	if (!target || !newOwner || !oldOwner) return null;
	const purchase = {
		id,
		viewerId,
		target,
		newOwner,
		oldOwner,
		price: payload.price
	};
	return haremNotice(purchase) ? purchase : null;
}
async function acknowledgeHaremNotice(id) {
	const sb = getSupabase();
	if (!sb) throw new Error("not_authenticated");
	const { error } = await sb.rpc("acknowledge_harem_notice", { p_id: id });
	if (error) throw error;
}
/** Subscribe before reading; recover unread rows after reconnect, tab return and lost packets. */
function subscribeHaremInbox(viewerId, receive, acknowledged) {
	const sb = getSupabase();
	if (!sb || !viewerId) return () => {};
	let alive = true, reading = false, retry = false;
	const deliver = (row) => {
		if (!alive) return;
		const p = decodeHaremNotice(row, viewerId);
		if (p) receive(p);
	};
	const recover = async () => {
		if (!alive) return;
		if (reading) {
			retry = true;
			return;
		}
		reading = true;
		try {
			let after = "0";
			while (alive) {
				const { data, error } = await sb.from("profile_notifications").select("id,user_id,payload,read_at").eq("user_id", viewerId).is("read_at", null).eq("payload->>type", "harem_purchase").gt("id", after).order("id", { ascending: true }).limit(100);
				if (!alive || error || !data?.length) break;
				data.forEach(deliver);
				after = String(data[data.length - 1]?.id ?? after);
				if (data.length < 100) break;
			}
		} finally {
			reading = false;
			if (alive && retry) {
				retry = false;
				recover();
			}
		}
	};
	const channel = sb.channel(`harem-inbox:${viewerId}`).on("postgres_changes", {
		event: "INSERT",
		schema: "public",
		table: "profile_notifications",
		filter: `user_id=eq.${viewerId}`
	}, (p) => deliver(p.new)).on("postgres_changes", {
		event: "UPDATE",
		schema: "public",
		table: "profile_notifications",
		filter: `user_id=eq.${viewerId}`
	}, (p) => {
		const row = p.new;
		if (alive && row.user_id === viewerId && row.read_at && row.id) acknowledged(String(row.id));
	}).subscribe((status) => {
		if (status === "SUBSCRIBED") recover();
	});
	recover();
	const visible = () => {
		if (document.visibilityState === "visible") recover();
	};
	document.addEventListener("visibilitychange", visible);
	const timer = window.setInterval(visible, 3e4);
	return () => {
		alive = false;
		window.clearInterval(timer);
		document.removeEventListener("visibilitychange", visible);
		sb.removeChannel(channel);
	};
}
var haremSourceText = {
	"dlg:harem:title": "Cəlb etmək",
	"dlg:harem:for": "istəyir",
	"dlg:harem:btn:v2": "Oldu",
	"dlg:harem:new:viewer:viewer": "%0 səni valeh etməyə başladı",
	"dlg:harem:new:viewer:old": "%0 səni digər istifadəçidən (%2) oğurladı",
	"dlg:harem:new:target:viewer": "%0 digər istifadəçini (%2) səndən oğurladı",
	"dlg:harem:target:target:viewer": "%0 səni tərk etdi"
};
/** Original HaremPurchaseDialog, fed only by authenticated host events. */
function SourceHaremNotice({ viewerId }) {
	const assets = useCilizAssets();
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const seen = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		seen.current.clear();
		setQueue([]);
		setBusy(false);
		return subscribeHaremInbox(viewerId, (p) => {
			if (seen.current.has(p.id)) return;
			seen.current.add(p.id);
			setQueue((q) => [...q, p].sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id)));
		}, (id) => {
			seen.current.add(id);
			setQueue((q) => q.filter((item) => item.id !== id));
		});
	}, [viewerId]);
	const p = queue[0];
	const notice = p ? haremNotice(p) : null;
	if (!assets || !p || p.viewerId !== viewerId || !notice) return null;
	const sourceAssets = {
		...assets,
		translation: {
			...assets.translation,
			...haremSourceText
		}
	};
	const close = () => {
		if (busy) return;
		setBusy(true);
		acknowledgeHaremNotice(p.id).then(() => setQueue((q) => q.filter((item) => item.id !== p.id)), () => showSourceToast("Bildirişi təsdiqləmək mümkün olmadı. Yenidən cəhd et.")).finally(() => setBusy(false));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SourceDialogLayer, {
		title: translate(sourceAssets, "dlg:harem:title"),
		hasClose: false,
		onClose: close,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "popup__content",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "source-harem",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "source-harem-user",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "source-harem-photo",
						"aria-label": notice.user.name,
						onClick: () => window.dispatchEvent(new CustomEvent("source:open-profile", { detail: notice.user.id })),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: notice.user.photoUrl,
							alt: ""
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "source-harem-name",
						children: notice.user.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "source-harem-description",
					children: [
						translate(sourceAssets, notice.key, ...notice.args),
						" ",
						translate(sourceAssets, "dlg:harem:for"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "source-harem-price",
							style: { backgroundImage: `url(${sourceHeart})` },
							children: String(p.price).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceButtons, { confirm: {
			title: translate(sourceAssets, "dlg:harem:btn:v2"),
			enabled: !busy,
			onClick: close
		} })]
	});
}
/** ProfileSettingsDialog validation 'male' (TGPresenter): gender is required, age is optional. */
function setupProblem(male) {
	return male === void 0 ? "male" : null;
}
/**
* Telegram build first entry (TGPresenter.showProfileRegistration): green screen with
* "Profil" dialog, gender tiles and an 18–90 age dropdown. Saved through complete_profile_setup.
*/
function ProfileSetupDialog({ onDone }) {
	const [assets, setAssets] = (0, import_react.useState)(null);
	const [male, setMale] = (0, import_react.useState)(void 0);
	const [age, setAge] = (0, import_react.useState)(void 0);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loadCilizAssets().then(setAssets).catch(() => setAssets(null));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const close = () => setOpen(false);
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [open]);
	const t = (k, fallback) => {
		const v = assets ? translate(assets, k) : k;
		return v === k ? fallback : v;
	};
	const valid = setupProblem(male) === null;
	const save = async () => {
		if (saving) return;
		if (!valid) {
			showSourceToast(t("dlg:profile_settings_tg:toast_setsex", "Cinsinizi seçin"));
			return;
		}
		const sb = getSupabase();
		if (!sb) return;
		setSaving(true);
		const { error } = await sb.rpc("complete_profile_setup", {
			p_male: male,
			p_age: age ?? null
		});
		if (error) {
			setSaving(false);
			showSourceToast(gameError(error.message));
			return;
		}
		await refreshProfile();
		onDone();
	};
	const ages = Array.from({ length: 73 }, (_, i) => 18 + i);
	const option = (a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "option",
		"aria-selected": a === age,
		className: `profile-settings__custom-option${a === age ? " profile-settings__custom-option--selected" : ""}`,
		onClick: () => {
			setAge(a);
			setOpen(false);
		},
		children: [a ?? "--", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "profile-settings__selected-icon" })]
	}, a ?? "none");
	const title = t("dlg:profile_info:title", "Profil");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "profile-setup-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "popup__dialog-manager",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "popup-shade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": title,
				className: "popup popup--center popup--show profile-settings__x_popup",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__header",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "popup__title",
							children: title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "popup__content profile-settings__x_popup__content",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "profile-settings__description",
								children: t("dlg:profile_settings_tg:text", "Özünüz haqqında məlumat verin. Masada oyunçuların uyğunlaşdırılması üçün bu məlumat lazımdır.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "profile-settings__item",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "profile-settings__gender-title",
									children: t("dlg:profile_settings_tg:gender", "Cins:")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "profile-settings__gender-items",
									role: "radiogroup",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										role: "radio",
										"aria-checked": male === true,
										"aria-label": t("dlg:gender:male", "Kişi"),
										className: `profile-settings__gender-item profile-settings__gender-item--male${male ? "" : " profile-settings__gender-item--inactive"}`,
										onClick: () => setMale(true)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										role: "radio",
										"aria-checked": male === false,
										"aria-label": t("dlg:gender:female", "Qadın"),
										className: `profile-settings__gender-item profile-settings__gender-item--female${male === false ? "" : " profile-settings__gender-item--inactive"}`,
										onClick: () => setMale(false)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "profile-settings__item",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "profile-settings__age-title",
									children: t("dlg:profile_settings_tg:age", "Yaş:")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `profile-settings__custom-select ${open ? "opened" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "profile-settings__custom-select-trigger",
										role: "button",
										"aria-haspopup": "listbox",
										onClick: (e) => {
											e.stopPropagation();
											setOpen(!open);
										},
										children: age ?? "--"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "profile-settings__custom-options",
										role: "listbox",
										onClick: (e) => e.stopPropagation(),
										children: [option(), ages.map(option)]
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "popup__buttons popup__buttons--center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "button",
							className: `button button--confirm${valid ? "" : " profile-settings__x_button--disabled"}`,
							onClick: () => void save(),
							children: t("dlg:profile_settings_tg:continue", "Davam et")
						})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceToastHost, {})]
	});
}
function Index() {
	const auth = useAuth();
	const navigate = useNavigate();
	const room = useRoom();
	const tableBg = useTableBg();
	const [joined, setJoined] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setupTelegramViewport(), []);
	(0, import_react.useEffect)(() => {
		if (!auth.ready) return;
		if (!auth.session || !auth.profile) {
			navigate({ to: "/auth" });
			return;
		}
		setViewerProfile(auth.profile);
		if (auth.profile.profile_setup_done === false) return;
		let alive = true;
		const connect = () => void joinRoom().then(() => {
			if (alive) setJoined(true);
		}).catch(() => {
			if (alive) setJoined(false);
		});
		connect();
		const stopAchievements = startCloudAchievements();
		const stopBlocks = startCloudBlocks(auth.session.user.id);
		const activity = window.setInterval(() => {
			getSupabase()?.rpc("activity_ping");
		}, 6e4);
		const bye = () => leaveRoomNow();
		const resume = () => {
			if (alive && document.visibilityState === "visible") connect();
		};
		const back = (e) => {
			if (e.persisted) connect();
		};
		window.addEventListener("pagehide", bye);
		window.addEventListener("pageshow", back);
		window.addEventListener("online", resume);
		document.addEventListener("visibilitychange", resume);
		return () => {
			alive = false;
			window.clearInterval(activity);
			stopAchievements();
			stopBlocks();
			window.removeEventListener("pagehide", bye);
			window.removeEventListener("pageshow", back);
			window.removeEventListener("online", resume);
			document.removeEventListener("visibilitychange", resume);
			detachRoom();
		};
	}, [
		auth.ready,
		auth.session?.user.id,
		Boolean(auth.profile),
		auth.profile?.profile_setup_done
	]);
	if (auth.profile && auth.profile.profile_setup_done === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSetupDialog, { onDone: () => void 0 });
	if (!joined || !room.roomId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: room.error ?? "Masaya qoşulursan…" }), room.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void joinRoom().then(() => setJoined(true)).catch(() => void 0),
			children: "Qayıt"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "original-table-page",
		"aria-label": "Deltagame oyun masası",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalLoadingScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceConnectionScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceHeartBonus, {}),
			auth.session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceHaremNotice, { viewerId: auth.session.user.id }, auth.session.user.id),
			auth.session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyBonusHost, { viewerId: auth.session.user.id }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "original-page-wood",
				src: original_wood_table_default,
				alt: ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "original-game",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "original-table",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "original-table-wood",
							src: original_wood_table_default,
							alt: "Taxta oyun masası"
						}),
						tableBg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "original-table-bg-image",
							src: tableBgUrl(tableBg),
							alt: ""
						}, tableBg),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableSeats, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalTableHeader, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalChatPanel, {})]
			})
		]
	});
}
//#endregion
export { Index as component };
