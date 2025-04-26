alter table "auth"."users" drop column "github_access_token";


create table "public"."github_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "github_username" text not null,
    "github_avatar_url" text,
    "github_bio" text,
    "github_access_token" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX github_profiles_pkey ON public.github_profiles USING btree (id);

CREATE UNIQUE INDEX github_profiles_user_id_key ON public.github_profiles USING btree (user_id);

alter table "public"."github_profiles" add constraint "github_profiles_pkey" PRIMARY KEY using index "github_profiles_pkey";

alter table "public"."github_profiles" add constraint "github_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."github_profiles" validate constraint "github_profiles_user_id_fkey";

alter table "public"."github_profiles" add constraint "github_profiles_user_id_key" UNIQUE using index "github_profiles_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_github_token()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_token TEXT;
BEGIN
  -- Retrieve the GitHub token from the user's GitHub profile
  SELECT github_access_token INTO v_token
  FROM public.github_profiles
  WHERE user_id = auth.uid();

  RETURN v_token;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.save_github_token(p_github_token text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update the GitHub token in the user's GitHub profile
  UPDATE public.github_profiles
  SET github_access_token = p_github_token,
      updated_at = timezone('utc', now())
  WHERE user_id = auth.uid();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  NEW.updated_at = timezone('utc', now());
  return NEW;
end;
$function$
;

grant delete on table "public"."github_profiles" to "anon";

grant insert on table "public"."github_profiles" to "anon";

grant references on table "public"."github_profiles" to "anon";

grant select on table "public"."github_profiles" to "anon";

grant trigger on table "public"."github_profiles" to "anon";

grant truncate on table "public"."github_profiles" to "anon";

grant update on table "public"."github_profiles" to "anon";

grant delete on table "public"."github_profiles" to "authenticated";

grant insert on table "public"."github_profiles" to "authenticated";

grant references on table "public"."github_profiles" to "authenticated";

grant select on table "public"."github_profiles" to "authenticated";

grant trigger on table "public"."github_profiles" to "authenticated";

grant truncate on table "public"."github_profiles" to "authenticated";

grant update on table "public"."github_profiles" to "authenticated";

grant delete on table "public"."github_profiles" to "service_role";

grant insert on table "public"."github_profiles" to "service_role";

grant references on table "public"."github_profiles" to "service_role";

grant select on table "public"."github_profiles" to "service_role";

grant trigger on table "public"."github_profiles" to "service_role";

grant truncate on table "public"."github_profiles" to "service_role";

grant update on table "public"."github_profiles" to "service_role";

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.github_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


