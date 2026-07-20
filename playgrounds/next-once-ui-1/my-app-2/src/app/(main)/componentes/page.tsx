import {
    Heading,
    Text,
    Row,
    Column,
    Badge,
    Logo,
    Line,
    LetterFx,
} from "@once-ui-system/core";
import { Schema } from "@once-ui-system/core";
import { baseURL, meta } from "@/resources/seo";

export default function Home() {
    return (
        <>
            <Row fillWidth fitHeight gap="16" s={{ direction: "column" }}>
                <Column fillWidth center>
                    col1
                </Column>
                <Column fill gap="16">
                    <Row fill center>
                        col2 row
                    </Row>
                    <Row fill center>
                        col2 row
                    </Row>
                </Column>
                <Column fillWidth center>
                    col3 col
                </Column>
            </Row>
            <Row background="brand-medium">
                <Text onBackground="brand-medium">Text on background</Text>
            </Row>
            <Row  solid="accent-medium">
                <Text onSolid="accent-strong">Text on solid</Text>
            </Row>
        </>
    );
}
