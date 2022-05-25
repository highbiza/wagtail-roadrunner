import { RoadrunnerRowBlockDefinition } from "./roadrunnerrowblock"
import { StylingBlockDefinition } from "./stylingblock"
import { RoadRunnerBaseBlockDefinition } from "./roadrunnerbaseblock"
import { ImageChooserBlockDefinition } from "./imagechooserblock"
import { PreviewStreamBlockDefinition } from "./preview/streamblock"
import { PreviewFieldBlockDefinition } from "./preview/fieldblock"
import { RichTextBlockDefinition } from "./richtextblock"

window.telepath.register('roadrunner.fields.RoadrunnerRowBlockDefinition', RoadrunnerRowBlockDefinition)
window.telepath.register('roadrunner.fields.StylingBlockDefinition', StylingBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewStreamBlockDefinition', PreviewStreamBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewFieldBlockDefinition', PreviewFieldBlockDefinition)
window.telepath.register('roadrunner.fields.RoadRunnerBaseBlockDefinition', RoadRunnerBaseBlockDefinition)
window.telepath.register('roadrunner.fields.ImageChooserBlockDefinition', ImageChooserBlockDefinition)
window.telepath.register('roadrunner.fields.RichTextBlockDefinition', RichTextBlockDefinition)
