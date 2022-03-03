import { useRef, useState } from "react";
import styled from "styled-components";

const Output = styled.textarea`
  width: 100%;
  max-width: 990px;
  margin-top: 3rem;
  background-color: #404551;
  padding: 1rem;
  background-color: #404551;
  border-radius: 0.25rem;
  height: 300px;
  color: white;
`;

const InputGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1;
    width: 100%;

    label {
      display: block;
      margin-bottom: 0.5rem;
    }
  }
`;

const Input = styled.input`
  background-color: #404551;
  width: 85%;
  border: none;
  border-radius: 0.25rem;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  outline: none;
`;

const Wrapper = styled.main`
  background-color: #2f333d;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Container = styled.div`
  max-width: 1024px;
  overflow-y: auto;
  width: 100%;
  margin: auto;

  p {
    margin: 0;
    font-size: 1rem;

    &.placeholder {
      text-align: center;
      opacity: 0.35;
    }
  }
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    margin-right: 2rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Button = styled.button`
  background-color: #794cff;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.25rem;
  border: none;
  outline: none;
  box-shadow: none;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #8c66ff;
    cursor: pointer;
  }
`;

const FileButton = styled.label`
  background-color: #794cff;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.25rem;
  border: none;
  outline: none;
  box-shadow: none;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #8c66ff;
    cursor: pointer;
  }

  input[type="file"] {
    width: 0;
    height: 0;
  }
`;

const flatfileImporter = (window as any).flatfileImporter;

export default function App(): any {
  const importerRef = useRef<any>();

  const [output, setOutput] = useState<string>();

  const [embedId, setEmbedId] = useState(
    localStorage.getItem("embed_id") || "8743364a-7b84-470f-b02d-46f5027a8973" // eddb35cc-0a1e-4aba-b947-471030e32c60
  );
  const [endUserEmail, setEndUserEmail] = useState(
    localStorage.getItem("end_user_email") || "jaak+test@sixfold.com"
  );
  const [privateKey, setPrivateKey] = useState(
    localStorage.getItem("private_key") ||
      "o9iORooYXBkGBiANEUupYnIbun5LaVWjJA4CgkVmn6JyWtbEG6FXgyPNdGk6azpm" // 4DX4SRejs2CZDMdz33H4Nk8b9iuHIte3ieoqIJQDMMsStDHNRgsoxOQblJPs0BxB
  );

  const handleInit = async () => {
    if (!embedId || !endUserEmail || !privateKey) {
      return alert("Embed id, user email & private key are required fields.");
    }

    localStorage.setItem("embed_id", embedId);
    localStorage.setItem("end_user_email", endUserEmail);
    localStorage.setItem("private_key", privateKey);

    // TOKEN has to be generated per user session on the server-side
    const importer = flatfileImporter("");

    await importer.__unsafeGenerateToken({
      embedId,
      endUserEmail,
      privateKey
    });

    importer.on("error", (error) => {
      console.error(error);
    });
    importer.on("complete", async (payload) => {
      const SAMPLE_DATA = true; // if true, it'll fetch only the first 1000 rows from the API; otherwise it'll fetch everything
      setOutput(JSON.stringify(await payload.data(SAMPLE_DATA), null, 4));
    });

    const { batchId } = await importer.launch();

    console.log(`${batchId} has been launched.`);

    importerRef.current = importer;
  };

  return (
    <Wrapper>
      <Container>
        <InputGroup>
          <div>
            <label>Embed ID</label>
            <Input
              placeholder="Enter embed ID"
              value={embedId}
              onChange={(e) => setEmbedId(e.target.value)}
            />
          </div>
          <div>
            <label>User Email</label>
            <Input
              placeholder="Enter user email"
              value={endUserEmail}
              onChange={(e) => setEndUserEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Private key</label>
            <Input
              type="password"
              placeholder="Enter private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>
        </InputGroup>

        <ButtonGroup>
          <Button onClick={() => handleInit()}>Launch</Button>
        </ButtonGroup>

        <Output
          readOnly
          placeholder="Data will appear here..."
          value={output}
        />
      </Container>
    </Wrapper>
  );
}
