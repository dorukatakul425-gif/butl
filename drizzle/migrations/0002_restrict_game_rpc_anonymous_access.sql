REVOKE ALL ON FUNCTION public.create_player_profile() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.in_room(uuid),public.join_game(),public.heartbeat_game(),public.leave_game(),public.play_round(text,text) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.purchase_game_item(uuid,uuid,text,text,bigint,bigint,boolean,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.in_room(uuid),public.join_game(),public.heartbeat_game(),public.leave_game(),public.play_round(text,text) TO authenticated;
CREATE FUNCTION public.player_stats(player uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT jsonb_build_object('kisses',kisses,'gestures',gestures,'hearts',hearts) FROM public.wallets WHERE user_id=player AND auth.uid() IS NOT NULL; $$;
REVOKE ALL ON FUNCTION public.player_stats(uuid) FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION public.player_stats(uuid) TO authenticated;