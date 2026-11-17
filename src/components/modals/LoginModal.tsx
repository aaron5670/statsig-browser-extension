import { Button, Input, Link } from "@heroui/react";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import DetailDialog from "~/components/DetailDialog";
import { ExternalLinkIcon } from "~/components/icons/ExternalLinkIcon";
import { initialLogin } from "~/handlers/initialLogin";

const LoginModal = ({ onConnect }: { onConnect: (key: string) => void }) => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isMutating, trigger } = useSWRMutation("/experiments", initialLogin);

  return (
    <DetailDialog
      dismissable={false}
      isOpen
      onClose={() => {}}
      size="compact"
      title="Connect to Statsig"
      description="Use a Statsig Console API key to load this project.">
      <form
        className="flex flex-col gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const key = value.trim();
          if (!key || isMutating) return;

          setErrorMessage("");
          try {
            const result = await trigger(key);
            if (result.success) onConnect(key);
            else setErrorMessage(result.error);
          } catch {
            setErrorMessage(
              "Couldn’t validate the key with Statsig. Try again."
            );
          }
        }}>
        <Input
          autoFocus
          autoComplete="off"
          errorMessage={errorMessage}
          isInvalid={!!errorMessage}
          isRequired
          label="Console API key"
          labelPlacement="outside"
          onValueChange={(next) => {
            setValue(next);
            setErrorMessage("");
          }}
          radius="sm"
          type="password"
          value={value}
          variant="bordered"
        />
        <p className="text-sm leading-relaxed text-foreground-600">
          A read-only key is enough to browse. Use a read/write key to manage
          experiment overrides.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className="gap-1.5 underline underline-offset-2"
            href="https://console.statsig.com/api_keys"
            rel="noreferrer"
            size="sm"
            target="_blank">
            Find your console keys
            <ExternalLinkIcon />
          </Link>
          <Button
            color="primary"
            isDisabled={!value.trim()}
            isLoading={isMutating}
            radius="sm"
            type="submit">
            Connect
          </Button>
        </div>
      </form>
    </DetailDialog>
  );
};

export default LoginModal;
