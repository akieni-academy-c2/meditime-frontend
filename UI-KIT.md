# UI kit MediTime

En développement : `/ui-kit`, sur ordinateur ou téléphone. Cette route n’est pas exposée par le build de production. Les exemples utilisent des données fictives et ne réalisent pas d’opérations métier. Les liens de navigation permettent d’ouvrir les routes de l’application.

## Correspondance des écrans et composants

| Écrans | Composants à réutiliser |
| --- | --- |
| Email, OTP, création de profil | `Brand`, `AuthButton`, `EmailField`, `CodeField`, `FormField`, `StepIndicator` |
| Accueil, recherche, fiche médecin | `AppHeader`, `TabBar`, `PersonCard`, `FormField`, `SelectField`, `DateStrip`, `SlotPicker` |
| Demande, récapitulatif, rendez-vous | `PersonCard`, `StatusBadge`, `FormField` avec `multiline`, `Tabs`, `EmptyState` |
| Accueil médecin, demandes et détails | `PersonCard`, `StatusBadge`, `SettingsRow`, `Dialog`, `PageHeader` |
| Planning, horaires et exceptions | `DateStrip`, `SlotPicker`, `ScheduleDay`, `AgendaList`, `FilterChips`, `SelectField`, `BottomSheet` |
| Paramètres, modes, informations médecin | `SettingsRow`, `FormField`, `SelectField`, `BottomSheet`, `Avatar` |

Les filtres par statut se composent avec `ui/tabs.jsx`. Les filtres de spécialité utilisent `SelectField`. Photo : `FormField type="file"` et `Avatar` pour l’aperçu. Les badges de compteur viennent de `TabBar` (`count`). Les icônes génériques et spécialités utilisent Lucide ; les avis, distances et cartes ne doivent pas être inventés si l’API ne les fournit pas.

## Imports et contrats

```jsx
import BottomSheet from '@/components/BottomSheet';
import { FormField, SelectField } from '@/components/FormsUI';
import { PersonCard, SettingsRow, EmptyState, LoadingState } from '@/components/CardsUI';
import { StatusBadge, DateStrip, SlotPicker, ScheduleDay } from '@/components/SchedulingUI';
import { AppHeader, PageHeader, TabBar, StepIndicator } from '@/components/NavigationUI';
```

- `FormField` : `label`, `hint`, `error`, `icon`, `multiline` et propriétés natives input/textarea. Les identifiants sont générés automatiquement.
- `SelectField` : `label`, `options=[{value,label}]`, `value`, `onValueChange`.
- `PersonCard` : `name`, `subtitle`, `avatarUrl`, `status`, `onClick`, `children`. Sans `onClick`, la carte est un article.
- `PersonAvatar` (`components/PersonAvatar.jsx`) : `name`, `avatarUrl`, `className`. Photo cadrée si disponible, sinon initiales du prénom et du nom via le fallback shadcn, y compris lorsque l’image ne charge pas. Les titres Dr/Docteur sont ignorés ; sans nom, affiche `?`. À accompagner du nom visible ou d’un libellé accessible sur le lien parent.
- `AppHeader` : `user={firstName,lastName,email,avatarUrl}`. Le raccourci de profil utilise le même avatar, avec le préfixe email si le nom n’est pas renseigné.
- `StatusBadge` : `pending`, `confirmed`, `declined`, `past`, `available`.
- `DateStrip` : `dates=[{value,day,date,label}]`, `value`, `onChange`. `label` décrit la date complète.
- `SlotPicker` : `slots=[{value,label,disabled}]`, `value`, `onChange`.
- `ScheduleDay` : `day`, `enabled`, `onEnabledChange`, `children` pour les plages.
- `AgendaList` : `entries=[{id,time,title,description,available}]`, `onSelect`.
- `FilterChips` : `options=[{value,label}]`, `value`, `onChange`, `label`.
- `TabBar` : `items=[{to,label,icon,count}]`, 3 entrées patient ou 4 médecin. À placer dans le layout connecté, jamais dans le login.
- `BottomSheet` : `open`, `onOpenChange`, `title`, `description`, `children`, `footer`, `headerMedia` et `className` facultatifs. Largeur mobile, contenu défilable, fermeture Échap, focus capturé puis restauré.
- `InstallSheet` (`pwa/InstallSheet.jsx`) : `open`, `onOpenChange`, `canInstall`, `onInstall`. Présentation seule ; `InstallAfterLogin` contrôle la proposition après authentification et `InstallProvider` gère l’invite native. L’aperçu du catalogue affiche les instructions manuelles.

```jsx
<BottomSheet open={open} onOpenChange={setOpen}
  title="Modifier pour aujourd’hui" description="Ajoutez une exception au planning."
  footer={<AuthButton onClick={save}>Enregistrer la modification</AuthButton>}>
  <FormField label="Heure de début" type="time" value={start} onChange={e => setStart(e.target.value)} />
</BottomSheet>
```

La page appelante gère les valeurs, erreurs, chargement et appels API. Les composants ne confèrent aucun droit, n’envoient aucune demande et ne confirment aucun rendez-vous eux-mêmes. Garder les validations serveur. Les états visuels ne constituent pas une implémentation des parcours métier.

## Style et recette

Tokens dans `src/styles.css` : primaire `#6528ff`, texte `#100d3e`, surface `#f6f5fb`, bordure `#e5e6f3`. Adapter les primitives shadcn dans `src/components/ui`, et les motifs MediTime dans les composants ci-dessus. Respecter les zones sûres mobiles et la navigation clavier.

Validation manuelle uniquement : sélectionner les valeurs, ouvrir/fermer sheets et dialogues, vérifier focus, erreurs, états désactivés et rendu à 360/390 px. Ne pas ajouter de suite de tests automatisés.
